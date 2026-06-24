// Find strings that match business keywords, resolve nearby Cython/PyMethodDef
// function pointers when possible, then export decompiler output for those functions.
//
// Usage:
//   analyzeHeadless <projectDir> <projectName> -import <binary> \
//     -postScript ExportStringReferenceFunctions.java <outputFile> <keyword...> [maxFunctions]

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileOptions;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.script.GhidraScript;
import ghidra.program.model.address.Address;
import ghidra.program.model.data.StringDataInstance;
import ghidra.program.model.listing.Data;
import ghidra.program.model.listing.DataIterator;
import ghidra.program.model.listing.Function;
import ghidra.program.model.symbol.Reference;
import ghidra.program.model.symbol.ReferenceIterator;

public class ExportStringReferenceFunctions extends GhidraScript {
    private static class MatchRecord {
        String text;
        Address stringAddress;
        Address referenceFrom;
        String resolution;

        MatchRecord(String text, Address stringAddress, Address referenceFrom, String resolution) {
            this.text = text;
            this.stringAddress = stringAddress;
            this.referenceFrom = referenceFrom;
            this.resolution = resolution;
        }
    }

    @Override
    protected void run() throws Exception {
        String[] args = getScriptArgs();
        if (args.length < 2) {
            printerr("Missing output file or keywordCsv argument.");
            return;
        }

        File outputFile = new File(args[0]);
        File parent = outputFile.getParentFile();
        if (parent != null) {
            parent.mkdirs();
        }

        int maxFunctions = 80;
        int keywordEnd = args.length;
        if (args.length >= 3 && isInteger(args[args.length - 1])) {
            maxFunctions = Integer.parseInt(args[args.length - 1]);
            keywordEnd = args.length - 1;
        }
        List<String> keywords = parseKeywords(args, 1, keywordEnd);

        LinkedHashMap<Function, List<MatchRecord>> functions = new LinkedHashMap<>();
        List<MatchRecord> stringOnlyMatches = new ArrayList<>();

        DataIterator dataIterator = currentProgram.getListing().getDefinedData(true);
        while (dataIterator.hasNext() && !monitor.isCancelled()) {
            Data data = dataIterator.next();
            String text = readString(data);
            if (text == null || !matchesAny(text, keywords)) {
                continue;
            }

            Address stringAddress = data.getAddress();
            ReferenceIterator references = currentProgram.getReferenceManager().getReferencesTo(stringAddress);
            boolean hadReference = false;
            while (references.hasNext()) {
                hadReference = true;
                Reference reference = references.next();
                Address from = reference.getFromAddress();
                Function direct = currentProgram.getFunctionManager().getFunctionContaining(from);
                if (direct != null) {
                    addRecord(functions, direct, new MatchRecord(text, stringAddress, from, "direct-code-reference"));
                    continue;
                }

                Function methodDefFunction = resolvePyMethodDefFunction(from);
                if (methodDefFunction != null) {
                    addRecord(functions, methodDefFunction,
                            new MatchRecord(text, stringAddress, from, "pymethoddef-pointer"));
                    continue;
                }

                stringOnlyMatches.add(new MatchRecord(text, stringAddress, from, "data-reference-only"));
            }

            if (!hadReference) {
                stringOnlyMatches.add(new MatchRecord(text, stringAddress, null, "no-reference"));
            }
        }

        DecompInterface decompiler = new DecompInterface();
        DecompileOptions options = new DecompileOptions();
        decompiler.setOptions(options);
        decompiler.openProgram(currentProgram);

        int exported = 0;
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(
                new FileOutputStream(outputFile), StandardCharsets.UTF_8))) {
            writer.write("# Ghidra String Reference Function Export\n\n");
            writer.write("Program: " + currentProgram.getName() + "\n");
            writer.write("Keywords: " + String.join(", ", keywords) + "\n\n");

            writer.write("## Matched String Records\n\n");
            for (Map.Entry<Function, List<MatchRecord>> entry : functions.entrySet()) {
                for (MatchRecord record : entry.getValue()) {
                    writer.write("- `" + compact(record.text) + "` at " + record.stringAddress
                            + " ref " + formatAddress(record.referenceFrom)
                            + " -> " + entry.getKey().getName(true)
                            + " [" + record.resolution + "]\n");
                }
            }
            for (MatchRecord record : stringOnlyMatches) {
                writer.write("- `" + compact(record.text) + "` at " + record.stringAddress
                        + " ref " + formatAddress(record.referenceFrom)
                        + " [" + record.resolution + "]\n");
            }

            writer.write("\n## Decompiled Functions\n\n");
            for (Map.Entry<Function, List<MatchRecord>> entry : functions.entrySet()) {
                if (exported >= maxFunctions || monitor.isCancelled()) {
                    break;
                }
                Function function = entry.getKey();
                writer.write("### " + function.getName(true) + "\n\n");
                writer.write("- Entry: " + function.getEntryPoint() + "\n");
                writer.write("- Body: " + function.getBody() + "\n");
                writer.write("- Matches: " + entry.getValue().size() + "\n\n");

                DecompileResults results = decompiler.decompileFunction(function, 90, monitor);
                if (results != null && results.decompileCompleted()) {
                    writer.write("```c\n");
                    writer.write(results.getDecompiledFunction().getC());
                    writer.write("\n```\n\n");
                } else {
                    String message = results == null ? "no result" : results.getErrorMessage();
                    writer.write("Decompile failed: " + message + "\n\n");
                }
                exported++;
            }
        } finally {
            decompiler.dispose();
        }

        println("Matched " + functions.size() + " functions and " + stringOnlyMatches.size()
                + " string-only records. Exported " + exported + " functions to "
                + outputFile.getAbsolutePath() + ".");
    }

    private List<String> parseKeywords(String[] args, int start, int end) {
        LinkedHashSet<String> keywords = new LinkedHashSet<>();
        for (int i = start; i < end; i++) {
            for (String raw : args[i].split(",")) {
                String keyword = raw.trim().toLowerCase();
                if (!keyword.isEmpty()) {
                    keywords.add(keyword);
                }
            }
        }
        return new ArrayList<>(keywords);
    }

    private boolean isInteger(String value) {
        try {
            Integer.parseInt(value);
            return true;
        } catch (NumberFormatException ignored) {
            return false;
        }
    }

    private String readString(Data data) {
        Object value = data.getValue();
        if (value instanceof String) {
            return (String) value;
        }
        try {
            StringDataInstance stringData = StringDataInstance.getStringDataInstance(data);
            if (stringData != null) {
                return stringData.getStringValue();
            }
        } catch (Exception ignored) {
            return null;
        }
        return null;
    }

    private boolean matchesAny(String text, List<String> keywords) {
        String lower = text.toLowerCase();
        for (String keyword : keywords) {
            if (lower.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private void addRecord(LinkedHashMap<Function, List<MatchRecord>> functions,
            Function function, MatchRecord record) {
        functions.computeIfAbsent(function, ignored -> new ArrayList<>()).add(record);
    }

    private Function resolvePyMethodDefFunction(Address namePointerAddress) {
        try {
            Address functionPointerAddress = namePointerAddress.add(8);
            long functionPointer = getLong(functionPointerAddress);
            Address target = toAddr(functionPointer);
            Function exact = currentProgram.getFunctionManager().getFunctionAt(target);
            if (exact != null) {
                return exact;
            }
            return currentProgram.getFunctionManager().getFunctionContaining(target);
        } catch (Exception ignored) {
            return null;
        }
    }

    private String formatAddress(Address address) {
        return address == null ? "-" : address.toString();
    }

    private String compact(String text) {
        return text.replace("\r", "\\r").replace("\n", "\\n");
    }
}
