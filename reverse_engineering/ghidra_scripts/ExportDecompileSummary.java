// Export function metadata and decompiler output for headless Ghidra runs.
// Usage:
//   analyzeHeadless <projectDir> <projectName> -import <binary> \
//     -postScript ExportDecompileSummary.java <outputFile> [nameFilter] [maxFunctions]

import java.io.BufferedWriter;
import java.io.File;
import java.io.OutputStreamWriter;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;

import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileOptions;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.script.GhidraScript;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionIterator;

public class ExportDecompileSummary extends GhidraScript {
    @Override
    protected void run() throws Exception {
        String[] args = getScriptArgs();
        if (args.length < 1) {
            printerr("Missing output file argument.");
            return;
        }

        File outputFile = new File(args[0]);
        File parent = outputFile.getParentFile();
        if (parent != null) {
            parent.mkdirs();
        }

        String nameFilter = args.length >= 2 ? args[1].toLowerCase() : "";
        int maxFunctions = Integer.MAX_VALUE;
        if (args.length >= 3) {
            maxFunctions = Integer.parseInt(args[2]);
        }

        DecompInterface decompiler = new DecompInterface();
        DecompileOptions options = new DecompileOptions();
        decompiler.setOptions(options);
        decompiler.openProgram(currentProgram);

        int exported = 0;
        int skipped = 0;

        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(
                new FileOutputStream(outputFile), StandardCharsets.UTF_8))) {
            writer.write("# Ghidra Decompile Summary\n\n");
            writer.write("Program: " + currentProgram.getName() + "\n");
            writer.write("Language: " + currentProgram.getLanguageID() + "\n");
            writer.write("Compiler: " + currentProgram.getCompilerSpec().getCompilerSpecID() + "\n");
            writer.write("Image base: " + currentProgram.getImageBase() + "\n\n");

            FunctionIterator functions = currentProgram.getFunctionManager().getFunctions(true);
            for (Function function : functions) {
                if (monitor.isCancelled()) {
                    break;
                }
                if (exported >= maxFunctions) {
                    break;
                }

                String name = function.getName();
                String fullName = function.getName(true);
                if (!nameFilter.isEmpty()
                        && !name.toLowerCase().contains(nameFilter)
                        && !fullName.toLowerCase().contains(nameFilter)) {
                    skipped++;
                    continue;
                }

                writer.write("## " + fullName + "\n\n");
                writer.write("- Entry: " + function.getEntryPoint() + "\n");
                writer.write("- Body: " + function.getBody() + "\n");
                writer.write("- External: " + function.isExternal() + "\n");
                writer.write("- Thunk: " + function.isThunk() + "\n\n");

                DecompileResults results = decompiler.decompileFunction(function, 60, monitor);
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

        println("Exported " + exported + " functions to " + outputFile.getAbsolutePath()
                + " (skipped " + skipped + ").");
    }
}
