# Hazel .pyd 静态分析报告

说明：本报告只做静态读取，不导入、不运行目标 `.pyd` 模块。Cython 编译产物无法直接还原原始 Python 源码；这里用于恢复模块职责、接口、状态字段和业务流程。

## 模块总览

| 模块 | 大小 | 导出 | 业务字符串数 | 识别符数 |
|---|---:|---|---:|---:|
| `api_server.cp312-win_amd64.pyd` | 258560 | `PyInit_api_server` | 55 | 264 |
| `desktop_api_server.cp312-win_amd64.pyd` | 754176 | `PyInit_desktop_api_server` | 107 | 300 |
| `auth.cp312-win_amd64.pyd` | 276480 | `PyInit_auth` | 4 | 354 |
| `automation_constants.cp312-win_amd64.pyd` | 16896 | `PyInit_automation_constants` | 2 | 38 |
| `automation_db.cp312-win_amd64.pyd` | 724480 | `PyInit_automation_db` | 6 | 445 |
| `excel_style_utils.cp312-win_amd64.pyd` | 45568 | `PyInit_excel_style_utils` | 10 | 86 |
| `model_api_key_store.cp312-win_amd64.pyd` | 61440 | `PyInit_model_api_key_store` | 14 | 109 |
| `profit_rate_rules.cp312-win_amd64.pyd` | 68608 | `PyInit_profit_rate_rules` | 10 | 113 |
| `runtime_profile.cp312-win_amd64.pyd` | 48640 | `PyInit_runtime_profile` | 3 | 93 |
| `userdata_paths.cp312-win_amd64.pyd` | 84480 | `PyInit_userdata_paths` | 3 | 134 |
| `utils.cp312-win_amd64.pyd` | 245760 | `PyInit_utils` | 7 | 293 |
| `excel_dao.cp312-win_amd64.pyd` | 294400 | `PyInit_excel_dao` | 13 | 284 |
| `ai_inquiry_service.cp312-win_amd64.pyd` | 386048 | `PyInit_ai_inquiry_service` | 10 | 366 |
| `ai_model_service.cp312-win_amd64.pyd` | 148480 | `PyInit_ai_model_service` | 5 | 219 |
| `ai_reply_freight_recalc_service.cp312-win_amd64.pyd` | 167936 | `PyInit_ai_reply_freight_recalc_service` | 10 | 196 |
| `ai_reply_service.cp312-win_amd64.pyd` | 478208 | `PyInit_ai_reply_service` | 10 | 382 |
| `alibaba_1688_login_service.cp312-win_amd64.pyd` | 227840 | `PyInit_alibaba_1688_login_service` | 13 | 282 |
| `alibaba_image_cutout_service.cp312-win_amd64.pyd` | 79360 | `PyInit_alibaba_image_cutout_service` | 11 | 118 |
| `auto_updater.cp312-win_amd64.pyd` | 165888 | `PyInit_auto_updater` | 4 | 239 |
| `automation_pipeline.cp312-win_amd64.pyd` | 666112 | `PyInit_automation_pipeline` | 8 | 396 |
| `browser_service.cp312-win_amd64.pyd` | 830464 | `PyInit_browser_service` | 26 | 411 |
| `calculator_service.cp312-win_amd64.pyd` | 78848 | `PyInit_calculator_service` | 6 | 109 |
| `drission_1688_browser.cp312-win_amd64.pyd` | 130560 | `PyInit_drission_1688_browser` | 14 | 190 |
| `exchange_rate_service.cp312-win_amd64.pyd` | 48128 | `PyInit_exchange_rate_service` | 4 | 87 |
| `image_vector_service.cp312-win_amd64.pyd` | 197120 | `PyInit_image_vector_service` | 10 | 240 |
| `maozierp_auto_listing_service.cp312-win_amd64.pyd` | 592384 | `PyInit_maozierp_auto_listing_service` | 13 | 388 |
| `maozierp_excel_listing_service.cp312-win_amd64.pyd` | 282112 | `PyInit_maozierp_excel_listing_service` | 15 | 338 |
| `maozierp_login_service.cp312-win_amd64.pyd` | 448000 | `PyInit_maozierp_login_service` | 16 | 380 |
| `maozierp_parallel_auto_listing_service.cp312-win_amd64.pyd` | 308224 | `PyInit_maozierp_parallel_auto_listing_service` | 5 | 340 |
| `plugin_bridge_service.cp312-win_amd64.pyd` | 99328 | `PyInit_plugin_bridge_service` | 4 | 134 |
| `plugin_path_service.cp312-win_amd64.pyd` | 100864 | `PyInit_plugin_path_service` | 6 | 164 |
| `product_text_ocr_service.cp312-win_amd64.pyd` | 164864 | `PyInit_product_text_ocr_service` | 10 | 235 |
| `source_1688_detail_service.cp312-win_amd64.pyd` | 424960 | `PyInit_source_1688_detail_service` | 6 | 372 |
| `source_1688_prompt_constants.cp312-win_amd64.pyd` | 22016 | `PyInit_source_1688_prompt_constants` | 4 | 41 |
| `source_1688_scratch_captcha_service.cp312-win_amd64.pyd` | 435712 | `PyInit_source_1688_scratch_captcha_service` | 8 | 361 |
| `source_1688_service.cp312-win_amd64.pyd` | 1229312 | `PyInit_source_1688_service` | 10 | 474 |
| `source_1688_third_party_api_service.cp312-win_amd64.pyd` | 155648 | `PyInit_source_1688_third_party_api_service` | 13 | 220 |
| `store_service.cp312-win_amd64.pyd` | 84480 | `PyInit_store_service` | 14 | 128 |
| `user_settings_service.cp312-win_amd64.pyd` | 96768 | `PyInit_user_settings_service` | 6 | 146 |

## api_server.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\controllers\api_server.cp312-win_amd64.pyd`
- 大小：258560 bytes
- 入口 RVA：`0x34c24`
- 导出：`PyInit_api_server`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 214528 | 214408 | `0x60000020` |
| `.rdata` | 29696 | 29244 | `0x40000040` |
| `.data` | 7168 | 12720 | `0xc0000040` |
| `.pdata` | 4608 | 4368 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 1024 | 516 | `0x42000040` |

### Imports

- `python312.dll`：`PyUnicode_DecodeUTF8`, `PyList_Sort`, `PyObject_GenericGetAttr`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`, `PyObject_Hash`, `PyUnicode_Concat`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### API 路径

- `controllers/api_server.py`

### 数据库/状态线索

- `controllers.api_server._enqueue_pending_item`
- `controllers.api_server._push_task_to_queue`

### 业务关键词字符串

- `Module 'api_server' has already been imported. Re-initialisation is not supported.`
- `PyInit_api_server`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `api_server.cp312-win_amd64.pyd`
- `controllers.api_server`
- `controllers.api_server.__pyx_scope_struct_1_genexpr`
- `controllers.api_server.__pyx_scope_struct_2__parse_weight_kg`
- `controllers.api_server.__pyx_scope_struct_3_genexpr`
- `controllers.api_server.__pyx_scope_struct_4_genexpr`
- `controllers.api_server.__pyx_scope_struct_5__parse_dimensions_cm`
- `controllers.api_server.__pyx_scope_struct_6_genexpr`
- `controllers.api_server.__pyx_scope_struct_7_genexpr`
- `controllers.api_server.__pyx_scope_struct__genexpr`
- `controllers.api_server._drain_pending_category_buffer`
- `controllers.api_server._extract_avg_price`
- `controllers.api_server._extract_commission_dict`
- `controllers.api_server._extract_competitor_count`
- `controllers.api_server._extract_days`
- `controllers.api_server._extract_rmb`
- `controllers.api_server._extract_store_id_from_url`
- `controllers.api_server._is_local_server_listening`
- `controllers.api_server._is_sku_pending`
- `controllers.api_server._maybe_record_seed_sku`
- `controllers.api_server._normalize_store_id`
- `controllers.api_server._parse_dimensions_cm`
- `controllers.api_server._parse_dimensions_cm.genexpr`
- `controllers.api_server._parse_int`
- `controllers.api_server._parse_percent`
- `controllers.api_server._parse_weight_kg`
- `controllers.api_server._parse_weight_kg.genexpr`
- `controllers.api_server._pick_first`
- `controllers.api_server._predict_primary_categories`
- `controllers.api_server._process_predicted_batch`
- `controllers.api_server._refresh_active_store_summary_locked`
- `controllers.api_server._refresh_active_store_summary_locked.genexpr`
- `controllers.api_server._reserve_shop_found_slot`
- `controllers.api_server._reserve_store_found_slot`
- `controllers.api_server._resolve_packet_store_id`
- `controllers.api_server.flush_category_filter_buffer`
- `controllers.api_server.get_pending_category_buffer_size`
- `controllers.api_server.get_store_found_count`
- `controllers.api_server.has_active_store_context`
- `controllers.api_server.local_log_bridge_health`
- `controllers.api_server.receive_data`
- `controllers.api_server.register_active_store_context`
- `controllers.api_server.reset_active_store_contexts`
- `controllers.api_server.reset_category_filter_state`
- `controllers.api_server.start_flask_server`
- `controllers.api_server.unregister_active_store_context`
- `controllers\api_server.c`
- `init controllers.api_server`
- `本地 API 服务控制器`

### 可见函数/变量名

- `AHHLII`
- `BUQUZX`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E333HUw`
- `E33Lu3HMH`
- `E3E33H`
- `E3E3E3`
- `E3EAHH`
- `E3HE0A`
- `E3HEHA`
- `E3HHAV`
- `E3HIlO`
- `E3HxHLp3A`
- `E3LMgHtYD9`
- `E3LMgM`
- `E3LeHt`
- `E3LeMt`
- `E3LegHt`
- `E3LmHHU33E3m`
- `E3MHEHu`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H1HuHt`
- `H3EH3H`
- `H3HE7H`
- `H3HEXIs`
- `H3HExH`
- `H3HLHt`
- `H6tPHHLOLAE`
- `H98tcH`
- `H98tcHA`
- `HChHMH`
- `HChMHMH`
- `HE0HXH`
- `HE3tNHOHLHAE`
- `HEHEHEH`
- `HEHEHEHEHE`
- `HEHEHEHEMt`
- `HEHHhL9Mt`
- `HEHHhff`
- `HEHHhfff`
- `HEIHU3HM`
- `HEPE3H`
- `HEPHE8`
- `HEPHEHMtBA9`
- `HEPHMHHt`
- `HEPLHu`
- `HEg3Ht`
- `HEgHEgHE`
- `HEgHEgHt`
- `HEh33L0H0Mt`
- `HEhL0H0Ht`
- `HEhLIF`
- `HExHupH`
- `HH9Upu`
- `HHE3HELe`
- `HHE3LMgD9`
- `HHHhH9`
- `HHHxyOHtH28`
- `HHLuhW`
- `HHM8H3g`
- `HHMgHA`
- `HHMh3I`
- `HHUgM3`
- `HHWHHu`
- `HHhL1LuMt`
- `HHt5LH`
- `HHt6LL`
- `HHt9HP`
- `HHtHMHp`
- `HHtOLIH`
- `HHt_LH`
- `HHte3Mt`
- `HHtj3Mt`
- `HHuBH5`
- `HIHIPHHt`
- `HIPIPPHt`

### PyInit 反汇编片段

```asm
0x180028af0: lea rcx, [rip + 0x167d9]
0x180028af7: jmp qword ptr [rip + 0xd8ca]
0x180028afe: int3
0x180028aff: int3
0x180028b00: push rsi
0x180028b02: sub rsp, 0x30
0x180028b06: mov rsi, rcx
0x180028b09: call qword ptr [rip + 0xda99]
0x180028b0f: mov rcx, qword ptr [rax + 0x10]
0x180028b13: call qword ptr [rip + 0xd617]
0x180028b19: cmp rax, -1
0x180028b1d: je 0x180028b6e
0x180028b1f: mov rdx, qword ptr [rip + 0x1657a]
0x180028b26: cmp rdx, -1
0x180028b2a: jne 0x180028b52
0x180028b2c: mov qword ptr [rip + 0x1656d], rax
0x180028b33: mov rax, qword ptr [rip + 0x18666]
0x180028b3a: test rax, rax
0x180028b3d: je 0x180028b76
0x180028b3f: mov ecx, dword ptr [rax]
0x180028b41: add ecx, 1
0x180028b44: je 0x180028c4d
0x180028b4a: mov dword ptr [rax], ecx
0x180028b4c: add rsp, 0x30
0x180028b50: pop rsi
0x180028b51: ret
0x180028b52: cmp rdx, rax
0x180028b55: je 0x180028b33
0x180028b57: mov rcx, qword ptr [rip + 0xd8f2]
0x180028b5e: lea rdx, [rip + 0xe94b]
0x180028b65: mov rcx, qword ptr [rcx]
0x180028b68: call qword ptr [rip + 0xd64a]
0x180028b6e: xor eax, eax
0x180028b70: add rsp, 0x30
0x180028b74: pop rsi
0x180028b75: ret
0x180028b76: mov qword ptr [rsp + 0x40], rbx
0x180028b7b: lea rdx, [rip + 0xe98e]
0x180028b82: mov qword ptr [rsp + 0x48], rbp
0x180028b87: mov rcx, rsi
```

## desktop_api_server.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\controllers\desktop_api_server.cp312-win_amd64.pyd`
- 大小：754176 bytes
- 入口 RVA：`0xa39e4`
- 导出：`PyInit_desktop_api_server`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 668672 | 668584 | `0x60000020` |
| `.rdata` | 62464 | 62104 | `0x40000040` |
| `.data` | 12288 | 24808 | `0xc0000040` |
| `.pdata` | 8192 | 8124 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 1024 | 884 | `0x42000040` |

### Imports

- `python312.dll`：`PyDict_Update`, `PyErr_Occurred`, `PyArg_ValidateKeywordArguments`, `PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyList_Sort`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 数据库/状态线索

- `controllers.desktop_api_server.__pyx_scope_struct_3__start_auto_listing_task`
- `controllers.desktop_api_server.__pyx_scope_struct_5__start_parallel_auto_listing_task`
- `controllers.desktop_api_server.__pyx_scope_struct___sort_auto_listing_rows_by_local_order`
- `controllers.desktop_api_server._apply_good_product_quota_status_to_state`
- `controllers.desktop_api_server._auto_listing_result_int`
- `controllers.desktop_api_server._drain_log_queue`
- `controllers.desktop_api_server._is_auto_listing_running`
- `controllers.desktop_api_server._load_auto_listing_store_order`
- `controllers.desktop_api_server._load_auto_listing_store_settings`
- `controllers.desktop_api_server._load_good_product_quota_status_for_current_device`
- `controllers.desktop_api_server._merge_auto_listing_store_settings`
- `controllers.desktop_api_server._merge_auto_listing_store_settings._pick_local_text`
- `controllers.desktop_api_server._normalize_auto_listing_count`
- `controllers.desktop_api_server._normalize_auto_listing_mode`
- `controllers.desktop_api_server._normalize_auto_listing_weight_source_from_settings`
- `controllers.desktop_api_server._normalize_start_auto_listing_stores`
- `controllers.desktop_api_server._prepare_auto_listing_login_cache`
- `controllers.desktop_api_server._queue_size`
- `controllers.desktop_api_server._run_auto_listing_excel_sequence`
- `controllers.desktop_api_server._run_auto_listing_excel_sequence.lambda3`
- `controllers.desktop_api_server._sanitize_status_payload`
- `controllers.desktop_api_server._save_auto_listing_store_settings`
- `controllers.desktop_api_server._sort_auto_listing_rows_by_local_order`
- `controllers.desktop_api_server._sort_auto_listing_rows_by_local_order.sort_key`
- `controllers.desktop_api_server._start_auto_listing_task`
- `controllers.desktop_api_server._start_auto_listing_task._worker`
- `controllers.desktop_api_server._start_auto_listing_task._worker.genexpr`
- `controllers.desktop_api_server._start_parallel_auto_listing_task`
- `controllers.desktop_api_server._start_parallel_auto_listing_task._worker`
- `controllers.desktop_api_server._start_parallel_auto_listing_task._worker.lambda5`
- `controllers.desktop_api_server._task_status_payload`
- `controllers.desktop_api_server._validate_auto_listing_plan`
- `controllers.desktop_api_server._validate_auto_listing_plan.genexpr`
- `controllers.desktop_api_server.auth_status_api`
- `controllers.desktop_api_server.auto_listing_start_api`
- `controllers.desktop_api_server.auto_listing_stop_api`
- `controllers.desktop_api_server.auto_listing_stores_api`
- `controllers.desktop_api_server.task_status_api`

### 业务关键词字符串

- ` HTTP API`
- `Module 'desktop_api_server' has already been imported. Re-initialisation is not supported.`
- `PyInit_desktop_api_server`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `Vue3/Electron 桌面端本地 API 服务`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `controllers.desktop_api_server`
- `controllers.desktop_api_server.__defaults__`
- `controllers.desktop_api_server.__pyx_defaults`
- `controllers.desktop_api_server.__pyx_defaults1`
- `controllers.desktop_api_server.__pyx_defaults2`
- `controllers.desktop_api_server.__pyx_defaults3`
- `controllers.desktop_api_server.__pyx_defaults4`
- `controllers.desktop_api_server.__pyx_defaults5`
- `controllers.desktop_api_server.__pyx_scope_struct_1_genexpr`
- `controllers.desktop_api_server.__pyx_scope_struct_2_genexpr`
- `controllers.desktop_api_server.__pyx_scope_struct_4_genexpr`
- `controllers.desktop_api_server.__pyx_scope_struct_6__start_ai_inquiry_task`
- `controllers.desktop_api_server.__pyx_scope_struct_7__start_ai_reply_task`
- `controllers.desktop_api_server._apply_runtime_config`
- `controllers.desktop_api_server._auth_payload`
- `controllers.desktop_api_server._auto_store_local_key`
- `controllers.desktop_api_server._auto_store_order_keys`
- `controllers.desktop_api_server._build_proxy_balance_payload`
- `controllers.desktop_api_server._coerce_bool`
- `controllers.desktop_api_server._default_settings`
- `controllers.desktop_api_server._ensure_good_product_daily_quota_can_start`
- `controllers.desktop_api_server._ensure_good_product_total_limit_can_start`
- `controllers.desktop_api_server._excel_same_key`
- `controllers.desktop_api_server._extract_silra_token_items`
- `controllers.desktop_api_server._fail`
- `controllers.desktop_api_server._fetch_proxy_api_key_balance`
- `controllers.desktop_api_server._fetch_proxy_api_key_balance.genexpr`
- `controllers.desktop_api_server._format_datetime`
- `controllers.desktop_api_server._get_authenticated_username`
- `controllers.desktop_api_server._get_quota_repo_and_user_id`
- `controllers.desktop_api_server._is_ai_inquiry_running`
- `controllers.desktop_api_server._is_ai_reply_running`
- `controllers.desktop_api_server._is_cpu_backend_runtime`
- `controllers.desktop_api_server._is_local_api_request_allowed`
- `controllers.desktop_api_server._is_thread_alive`
- `controllers.desktop_api_server._merge_good_product_quota_into_settings`
- `controllers.desktop_api_server._merged_settings`
- `controllers.desktop_api_server._normalize_ai_inquiry_message`
- `controllers.desktop_api_server._normalize_ai_provider_value`
- `controllers.desktop_api_server._normalize_auto_store_local_settings`
- `controllers.desktop_api_server._normalize_auto_store_order`
- `controllers.desktop_api_server._normalize_good_product_total_limit_from_settings`
- `controllers.desktop_api_server._normalize_list`
- `controllers.desktop_api_server._normalize_model_runtime_device_value`
- `controllers.desktop_api_server._normalize_profit_rate_rule`
- `controllers.desktop_api_server._normalize_qwen_api_channel`
- `controllers.desktop_api_server._normalize_shipping_channel_value`
- `controllers.desktop_api_server._ok`
- `controllers.desktop_api_server._prepare_and_start_automation`
- `controllers.desktop_api_server._request_stop_automation`
- `controllers.desktop_api_server._require_local_api_token`
- `controllers.desktop_api_server._resolve_current_automation_user_id_for_records`
- `controllers.desktop_api_server._resolve_existing_excel_path`
- `controllers.desktop_api_server._resolve_good_product_daily_limit`
- `controllers.desktop_api_server._resolve_model_runtime_device_for_backend`
- `controllers.desktop_api_server._resolve_product_excel_path`
- `controllers.desktop_api_server._run_maozierp_login`
- `controllers.desktop_api_server._safe_float`
- `controllers.desktop_api_server._safe_int`
- `controllers.desktop_api_server._save_good_product_quota_refresh_hour_for_current_device`
- `controllers.desktop_api_server._save_local_license_key`
- `controllers.desktop_api_server._save_settings_payload`
- `controllers.desktop_api_server._settings_for_current_auth`
- `controllers.desktop_api_server._settings_meta_payload`
- `controllers.desktop_api_server._start_ai_inquiry_task`
- `controllers.desktop_api_server._start_ai_inquiry_task._worker`
- `controllers.desktop_api_server._start_ai_inquiry_task._worker.lambda6`
- `controllers.desktop_api_server._start_ai_reply_task`
- `controllers.desktop_api_server._start_ai_reply_task._worker`
- `controllers.desktop_api_server._start_ai_reply_task._worker.lambda7`
- `controllers.desktop_api_server._start_automation_controller`
- `controllers.desktop_api_server._sync_authenticated_session`

### 可见函数/变量名

- `AHHLII`
- `Aji1j9`
- `C5LuHH`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E333IH`
- `E33E30`
- `E33E3C`
- `E33E3b`
- `E33E3c`
- `E33E3d`
- `E33E3e`
- `E33E3f`
- `E33E3g`
- `E33E3h`
- `E33E3q`
- `E33E3r`
- `E33E3s`
- `E33E3t`
- `E33E3u`
- `E33E3w`
- `E33E3x`
- `E33E3y`
- `E33E3z`
- `E33HHL`
- `E3BuD3`
- `E3E33A`
- `E3E33HF`
- `E3E33Hho`
- `E3E3E3`
- `E3E3ED`
- `E3E3Eq`
- `E3E3Et`
- `E3E3Ew`
- `E3E3Fj`
- `E3E3HE`
- `E3E3HE8A`
- `E3E3HEPA`
- `E3E3HEhA`
- `E3E3HEpA`
- `E3E3HHL`
- `E3E3IIH`
- `E3E3Mt`
- `E3E3QW`
- `E3HELu`
- `E3HGPH`
- `E3HHEHELC`
- `E3HM8Ht7Li`
- `E3HUHH`
- `E3HUxI`
- `E3HuLH`
- `E3HuMHE`
- `E3HuXA`
- `E3HuxMH`
- `E3IEE3`
- `E3L5yy`
- `E3LEMu`
- `E3LHELe`
- `E3LHELu`
- `E3LM9g`
- `E3LeHHt`
- `E3LeIHu`
- `E3LeMHuHUHh`
- `E3LehA`
- `E3LmLLeHUH`
- `E3LmLLuHUH`
- `E3LuHt`
- `E3LuLHE`
- `E3LuMHE`
- `E3LuMHuHUH`
- `E3MHELe`
- `E3MHELu`
- `E3MHEPLmH`
- `E3MtQII`
- `Et_HyZH`
- `EwHEHE`
- `GHGpHH`
- `GetCurrentProcessId`
- `GetCurrentThreadId`

### PyInit 反汇编片段

```asm
0x18008b4d0: lea rcx, [rip + 0x2b439]
0x18008b4d7: jmp qword ptr [rip + 0x19f9a]
0x18008b4de: int3
0x18008b4df: int3
0x18008b4e0: push rsi
0x18008b4e2: sub rsp, 0x30
0x18008b4e6: mov rsi, rcx
0x18008b4e9: call qword ptr [rip + 0x1a1a9]
0x18008b4ef: mov rcx, qword ptr [rax + 0x10]
0x18008b4f3: call qword ptr [rip + 0x19c5f]
0x18008b4f9: cmp rax, -1
0x18008b4fd: je 0x18008b54e
0x18008b4ff: mov rdx, qword ptr [rip + 0x2ac1a]
0x18008b506: cmp rdx, -1
0x18008b50a: jne 0x18008b532
0x18008b50c: mov qword ptr [rip + 0x2ac0d], rax
0x18008b513: mov rax, qword ptr [rip + 0x2fbbe]
0x18008b51a: test rax, rax
0x18008b51d: je 0x18008b556
0x18008b51f: mov ecx, dword ptr [rax]
0x18008b521: add ecx, 1
0x18008b524: je 0x18008b62d
0x18008b52a: mov dword ptr [rax], ecx
0x18008b52c: add rsp, 0x30
0x18008b530: pop rsi
0x18008b531: ret
0x18008b532: cmp rdx, rax
0x18008b535: je 0x18008b513
0x18008b537: mov rcx, qword ptr [rip + 0x19fe2]
0x18008b53e: lea rdx, [rip + 0x1d23b]
0x18008b545: mov rcx, qword ptr [rcx]
0x18008b548: call qword ptr [rip + 0x19cba]
0x18008b54e: xor eax, eax
0x18008b550: add rsp, 0x30
0x18008b554: pop rsi
0x18008b555: ret
0x18008b556: mov qword ptr [rsp + 0x40], rbx
0x18008b55b: lea rdx, [rip + 0x1d27e]
0x18008b562: mov qword ptr [rsp + 0x48], rbp
0x18008b567: mov rcx, rsi
```

## auth.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\core\auth.cp312-win_amd64.pyd`
- 大小：276480 bytes
- 入口 RVA：`0x384a4`
- 导出：`PyInit_auth`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 229376 | 228872 | `0x60000020` |
| `.rdata` | 30720 | 30716 | `0x40000040` |
| `.data` | 8704 | 14320 | `0xc0000040` |
| `.pdata` | 5120 | 4848 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 1024 | 564 | `0x42000040` |

### Imports

- `python312.dll`：`PyUnicode_DecodeUTF8`, `PyList_Sort`, `PyObject_GenericGetAttr`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`, `PyObject_Hash`, `PyUnicode_Concat`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### API 路径

- `core/auth.py`

### 数据库/状态线索

- `Return the currently selected HWID value.`

### 业务关键词字符串

- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`

### 可见函数/变量名

- `AHHLIJ`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `Dy0HMo`
- `E33E3H`
- `E33E3LELE`
- `E33LeE3LELE`
- `E3E333`
- `E3E33HAk`
- `E3E3E3`
- `E3EAHH`
- `E3HEEb`
- `E3HEHEHE`
- `E3HEHH`
- `E3HEHI`
- `E3HEHuH`
- `E3HEMH`
- `E3HGhH`
- `E3IEhH`
- `E3MHELm`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H1HuHt`
- `H3EH3H`
- `H3HLHt`
- `H3HLPHt`
- `H3HLXHt`
- `H98tcH`
- `H98tcHA`
- `HE0HXH`
- `HE3E3H`
- `HE3HEHu`
- `HE3HELu`
- `HEE3HEHH`
- `HEHEH8`
- `HEHEHh`
- `HEHHhH`
- `HEHHhf`
- `HEHUE3HEA`
- `HELHHu`
- `HEgHHu`
- `HEh33L0H0Mt`
- `HEhL0H0Ht`
- `HEhLIF`
- `HEoHHhL9Mt`
- `HEoIMLug8`
- `HEwHHhfH9Ht`
- `HH9Upu`
- `HHEHHh`
- `HHEgE3E33`
- `HHHhH9`
- `HHHhL9Mt`
- `HHHxyOHtH28`
- `HHLuhW`
- `HHMHHHt`
- `HHMh3I`
- `HHMxH3v`
- `HHt5LH`
- `HHt6LL`
- `HHt9HP`
- `HHtOLIH`
- `HHtSHH`
- `HHt_LH`
- `HHto6H`
- `HHu0L5`
- `HHu5E3`
- `HI3E3E33`
- `HIE3E3`
- `HIHIPHHt`
- `HIPIPPHt`
- `HLEoHUwZ`
- `HME3HXM`
- `HMgMLmgHt`
- `HO8DHM`
- `HU0HM0E3H`
- `HU8E3Hu8I`
- `HUE3HEA`

### Cython 符号

- `core.auth`
- `core.auth.__pyx_scope_struct_10_genexpr`
- `core.auth.__pyx_scope_struct_1_genexpr`
- `core.auth.__pyx_scope_struct_2_genexpr`
- `core.auth.__pyx_scope_struct_3__text_score`
- `core.auth.__pyx_scope_struct_4_genexpr`
- `core.auth.__pyx_scope_struct_5_genexpr`
- `core.auth.__pyx_scope_struct_6_genexpr`
- `core.auth.__pyx_scope_struct_7_verify_signature`
- `core.auth.__pyx_scope_struct_8_genexpr`
- `core.auth.__pyx_scope_struct_9__is_retryable_hwid_error`
- `core.auth.__pyx_scope_struct___contains_mojibake_marker`
- `core.auth._apply_server_feature_flags`
- `core.auth._build_current_hwid_context`
- `core.auth._build_request_device_identity`
- `core.auth._cached_identity_matches`
- `core.auth._coerce_bool`
- `core.auth._contains_mojibake_marker`
- `core.auth._contains_mojibake_marker.genexpr`
- `core.auth._get_legacy_raw_hwid`
- `core.auth._get_mac_value`
- `core.auth._get_machine_guid`
- `core.auth._get_or_create_install_id`
- `core.auth._get_volume_serial`
- `core.auth._get_windows_bios_uuid`
- `core.auth._hash_hwid`
- `core.auth._is_cjk`
- `core.auth._is_retryable_hwid_error`
- `core.auth._is_retryable_hwid_error.genexpr`
- `core.auth._is_valid_hwid_component`
- `core.auth._load_cached_device_identity`
- `core.auth._looks_like_normal_chinese`
- `core.auth._looks_like_normal_chinese.genexpr`
- `core.auth._parse_server_datetime`
- `core.auth._parse_wmic_uuid`
- `core.auth._persist_hwid_context`
- `core.auth._post_auth_with_hwid_candidates`
- `core.auth._reset_server_feature_flags`
- `core.auth._resolve_hwid_context`
- `core.auth._run_command`
- `core.auth._save_cached_device_identity`
- `core.auth._text_score`
- `core.auth._text_score.genexpr`
- `core.auth.activate_user`
- `core.auth.change_user_password`
- `core.auth.check_session_online`
- `core.auth.fetch_auto_listing_store_bindings`
- `core.auth.get_hwid`
- `core.auth.login_user`
- `core.auth.register_user`
- `core.auth.sanitize_message`
- `core.auth.save_auto_listing_store_bindings`
- `core.auth.update_auto_listing_store_enabled`
- `core.auth.verify_license`
- `core.auth.verify_signature`
- `core.auth.verify_signature.genexpr`

### PyInit 反汇编片段

```asm
0x18002cc20: lea rcx, [rip + 0x155e9]
0x18002cc27: jmp qword ptr [rip + 0xc7d2]
0x18002cc2e: int3
0x18002cc2f: int3
0x18002cc30: push rsi
0x18002cc32: sub rsp, 0x30
0x18002cc36: mov rsi, rcx
0x18002cc39: call qword ptr [rip + 0xc9b9]
0x18002cc3f: mov rcx, qword ptr [rax + 0x10]
0x18002cc43: call qword ptr [rip + 0xc4e7]
0x18002cc49: cmp rax, -1
0x18002cc4d: je 0x18002cc9e
0x18002cc4f: mov rdx, qword ptr [rip + 0x1516a]
0x18002cc56: cmp rdx, -1
0x18002cc5a: jne 0x18002cc82
0x18002cc5c: mov qword ptr [rip + 0x1515d], rax
0x18002cc63: mov rax, qword ptr [rip + 0x17b76]
0x18002cc6a: test rax, rax
0x18002cc6d: je 0x18002cca6
0x18002cc6f: mov ecx, dword ptr [rax]
0x18002cc71: add ecx, 1
0x18002cc74: je 0x18002cd7d
0x18002cc7a: mov dword ptr [rax], ecx
0x18002cc7c: add rsp, 0x30
0x18002cc80: pop rsi
0x18002cc81: ret
0x18002cc82: cmp rdx, rax
0x18002cc85: je 0x18002cc63
0x18002cc87: mov rcx, qword ptr [rip + 0xc80a]
0x18002cc8e: lea rdx, [rip + 0xd7ab]
0x18002cc95: mov rcx, qword ptr [rcx]
0x18002cc98: call qword ptr [rip + 0xc532]
0x18002cc9e: xor eax, eax
0x18002cca0: add rsp, 0x30
0x18002cca4: pop rsi
0x18002cca5: ret
0x18002cca6: mov qword ptr [rsp + 0x40], rbx
0x18002ccab: lea rdx, [rip + 0xd7ee]
0x18002ccb2: mov qword ptr [rsp + 0x48], rbp
0x18002ccb7: mov rcx, rsi
```

## automation_constants.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\core\automation_constants.cp312-win_amd64.pyd`
- 大小：16896 bytes
- 入口 RVA：`0x2424`
- 导出：`PyInit_automation_constants`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 7680 | 7544 | `0x60000020` |
| `.rdata` | 6144 | 6070 | `0x40000040` |
| `.data` | 512 | 688 | `0xc0000040` |
| `.pdata` | 512 | 504 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 64 | `0x42000040` |

### Imports

- `python312.dll`：`PyErr_Format`, `PyDict_Type`, `PyModule_NewObject`, `PyType_IsSubtype`, `_Py_Dealloc`, `PyImport_GetModuleDict`, `PyModule_GetDict`, `PyErr_ExceptionMatches`, `PyObject_CallFunctionObjArgs`, `Py_Version`, `PyImport_AddModule`, `PyObject_GetAttrString`
- `KERNEL32.dll`：`QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `DisableThreadLibraryCalls`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`__C_specific_handler`, `__std_type_info_destroy_list`, `memcpy`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initterm`, `_execute_onexit_table`, `_cexit`, `_initialize_onexit_table`

### API 路径

- `core/automation_constants.py`

### 业务关键词字符串

- `PyObject_VectorcallDict`
- `api-ms-win-crt-runtime-l1-1-0.dll`

### 可见函数/变量名

- `DisableThreadLibraryCalls`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H3EH3H`
- `H3HEpH`
- `HHt5LH`
- `HHt_LH`
- `InitializeSListHead`
- `QueryPerformanceCounter`
- `RichvA`
- `__C_specific_handler`
- `__builtins__`
- `__file__`
- `__loader__`
- `__package__`
- `__path__`
- `__std_type_info_destroy_list`
- `_cexit`
- `_configure_narrow_argv`
- `_execute_onexit_table`
- `_initialize_narrow_environment`
- `_initialize_onexit_table`
- `_initterm`
- `_initterm_e`
- `_seh_filter_dll`
- `automation_constants`
- `builtins`
- `cython_runtime`
- `decompress`
- `loader`
- `memcpy`
- `ntelineI`
- `origin`
- `parent`
- `submodule_search_locations`
- `u6u2L3Iz`

### Cython 符号

- `core.automation_constants`

### PyInit 反汇编片段

```asm
0x180001000: lea rcx, [rip + 0x40b9]
0x180001007: jmp qword ptr [rip + 0x2122]
0x18000100e: int3
0x18000100f: int3
0x180001010: push rsi
0x180001012: sub rsp, 0x30
0x180001016: mov rsi, rcx
0x180001019: call qword ptr [rip + 0x2221]
0x18000101f: mov rcx, qword ptr [rax + 0x10]
0x180001023: call qword ptr [rip + 0x219f]
0x180001029: cmp rax, -1
0x18000102d: je 0x18000107e
0x18000102f: mov rdx, qword ptr [rip + 0x407a]
0x180001036: cmp rdx, -1
0x18000103a: jne 0x180001062
0x18000103c: mov qword ptr [rip + 0x406d], rax
0x180001043: mov rax, qword ptr [rip + 0x4256]
0x18000104a: test rax, rax
0x18000104d: je 0x180001086
0x18000104f: mov ecx, dword ptr [rax]
0x180001051: add ecx, 1
0x180001054: je 0x18000115d
0x18000105a: mov dword ptr [rax], ecx
0x18000105c: add rsp, 0x30
0x180001060: pop rsi
0x180001061: ret
0x180001062: cmp rdx, rax
0x180001065: je 0x180001043
0x180001067: mov rcx, qword ptr [rip + 0x20ea]
0x18000106e: lea rdx, [rip + 0x22fb]
0x180001075: mov rcx, qword ptr [rcx]
0x180001078: call qword ptr [rip + 0x2092]
0x18000107e: xor eax, eax
0x180001080: add rsp, 0x30
0x180001084: pop rsi
0x180001085: ret
0x180001086: mov qword ptr [rsp + 0x40], rbx
0x18000108b: lea rdx, [rip + 0x233e]
0x180001092: mov qword ptr [rsp + 0x48], rbp
0x180001097: mov rcx, rsi
```

## automation_db.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\core\automation_db.cp312-win_amd64.pyd`
- 大小：724480 bytes
- 入口 RVA：`0x9d754`
- 导出：`PyInit_automation_db`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 643584 | 643256 | `0x60000020` |
| `.rdata` | 58368 | 57966 | `0x40000040` |
| `.data` | 11264 | 21440 | `0xc0000040` |
| `.pdata` | 8704 | 8544 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 1024 | 944 | `0x42000040` |

### Imports

- `python312.dll`：`PyArg_ValidateKeywordArguments`, `PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyNumber_Absolute`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### API 路径

- `core/automation_db.py`

### 业务关键词字符串

- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `skus`
- `种子 SKU`

### 可见函数/变量名

- `AHHLII`
- `CtLmwCt`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DHUDHU`
- `DIpLLq`
- `DisableThreadLibraryCalls`
- `E333Ak`
- `E333L5`
- `E33E3E33`
- `E33E3H5`
- `E33H2n`
- `E33HEH5`
- `E33HLhHt`
- `E3AEAL5`
- `E3E333E3L`
- `E3E33A`
- `E3E33E33Y`
- `E3E33H5`
- `E3E33H5h`
- `E3E33L`
- `E3E3E3`
- `E3E3E3H`
- `E3HEHI`
- `E3HEpI`
- `E3HExI`
- `E3HMMm`
- `E3HMa0`
- `E3Hu0A`
- `E3HuHA`
- `E3HuhA`
- `E3IEhHUH`
- `E3LELEE3LE`
- `E3LHELe`
- `E3LMAM`
- `E3LMILM`
- `E3LuLuLuH`
- `E3LuhA`
- `Eco5cF`
- `GHGpHH`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0E3Ht`
- `H0L0Ht`
- `H1HuHt`
- `H3EH3H`
- `H3HE03Is`
- `H3HE0H`
- `H3HE8Is`
- `H3HEH9x`
- `H3HEIs`
- `H3HEPIs`
- `H3HExL`
- `H3HLHt`
- `H3HLPHt`
- `H3fHLHt`
- `H98tcH`
- `H98tcHA`
- `HAhMMH`
- `HE0HE8H`
- `HE0HXH`
- `HE3HEx`
- `HE3HME`
- `HE8LHu`
- `HEHEHEHEHEH`
- `HEHELE`
- `HEHEp3HExHuh`
- `HEHHEHH`
- `HEHHhH`
- `HEHHhf`
- `HEHHhfH`
- `HEHHhfff`
- `HEHMLm`
- `HEHUE3HEA`
- `HEHu9H`
- `HEHuqLF`
- `HELHE9`
- `HELHHu`
- `HELm92ME`

### Cython 符号

- `core.automation_db`
- `core.automation_db.AutomationTaskRepository.__init__`
- `core.automation_db.AutomationTaskRepository._add_index_if_missing`
- `core.automation_db.AutomationTaskRepository._chunk_values`
- `core.automation_db.AutomationTaskRepository._claim_tasks`
- `core.automation_db.AutomationTaskRepository._column_exists`
- `core.automation_db.AutomationTaskRepository._count_all`
- `core.automation_db.AutomationTaskRepository._count_by_status`
- `core.automation_db.AutomationTaskRepository._create_auto_listing_record_table`
- `core.automation_db.AutomationTaskRepository._create_good_product_daily_quota_table`
- `core.automation_db.AutomationTaskRepository._create_good_sku_table`
- `core.automation_db.AutomationTaskRepository._create_legacy_tables`
- `core.automation_db.AutomationTaskRepository._create_migration_table`
- `core.automation_db.AutomationTaskRepository._create_onebound_1688_item_get_response_table`
- `core.automation_db.AutomationTaskRepository._create_queue_seen_tables`
- `core.automation_db.AutomationTaskRepository._create_source_1688_match_table`
- `core.automation_db.AutomationTaskRepository._delete_queue_task`
- `core.automation_db.AutomationTaskRepository._ensure_auto_listing_record_detail_columns`
- `core.automation_db.AutomationTaskRepository._ensure_good_product_quota_row_locked`
- `core.automation_db.AutomationTaskRepository._ensure_onebound_1688_response_detail_columns`
- `core.automation_db.AutomationTaskRepository._ensure_queue_lease_columns`
- `core.automation_db.AutomationTaskRepository._ensure_seed_failure_columns`
- `core.automation_db.AutomationTaskRepository._ensure_source_1688_match_detail_columns`
- `core.automation_db.AutomationTaskRepository._fetch_db_beijing_now`
- `core.automation_db.AutomationTaskRepository._format_quota_datetime`
- `core.automation_db.AutomationTaskRepository._index_exists`
- `core.automation_db.AutomationTaskRepository._load_seed_rows_for_user`
- `core.automation_db.AutomationTaskRepository._migrate_legacy_queue_seen_data`
- `core.automation_db.AutomationTaskRepository._normalize_good_product_daily_limit`
- `core.automation_db.AutomationTaskRepository._normalize_good_product_quota_period_locked`
- `core.automation_db.AutomationTaskRepository._normalize_quota_refresh_hour`
- `core.automation_db.AutomationTaskRepository._public_quota_status`
- `core.automation_db.AutomationTaskRepository._release_stale_locks_with_cursor`
- `core.automation_db.AutomationTaskRepository._rename_or_migrate_column`
- `core.automation_db.AutomationTaskRepository._reset_tasks`
- `core.automation_db.AutomationTaskRepository._select_existing_values`
- `core.automation_db.AutomationTaskRepository._select_existing_values_for_users`
- `core.automation_db.AutomationTaskRepository._select_recent_store_seen_values`
- `core.automation_db.AutomationTaskRepository.add_seed_sku_safe`
- `core.automation_db.AutomationTaskRepository.add_store_task_safe`
- `core.automation_db.AutomationTaskRepository.bulk_add_seed_skus`
- `core.automation_db.AutomationTaskRepository.bulk_add_store_tasks_safe`
- `core.automation_db.AutomationTaskRepository.bulk_insert_auto_listing_records`
- `core.automation_db.AutomationTaskRepository.bulk_insert_auto_listing_records._date_value`
- `core.automation_db.AutomationTaskRepository.bulk_insert_auto_listing_records._decimal`
- `core.automation_db.AutomationTaskRepository.bulk_insert_auto_listing_records._rule_code`
- `core.automation_db.AutomationTaskRepository.bulk_insert_auto_listing_records._text`
- `core.automation_db.AutomationTaskRepository.bulk_mark_store_seen_and_remove_queue`
- `core.automation_db.AutomationTaskRepository.calculate_good_product_quota_period`
- `core.automation_db.AutomationTaskRepository.claim_seed_tasks`
- `core.automation_db.AutomationTaskRepository.claim_store_tasks`
- `core.automation_db.AutomationTaskRepository.clone_seed_skus_from_global_pool`
- `core.automation_db.AutomationTaskRepository.clone_seed_skus_from_user_pool`
- `core.automation_db.AutomationTaskRepository.count_open_seed_tasks`
- `core.automation_db.AutomationTaskRepository.count_open_store_tasks`
- `core.automation_db.AutomationTaskRepository.count_pending_seed_tasks`
- `core.automation_db.AutomationTaskRepository.count_pending_store_tasks`
- `core.automation_db.AutomationTaskRepository.count_total_good_skus`
- `core.automation_db.AutomationTaskRepository.count_total_good_stores`
- `core.automation_db.AutomationTaskRepository.count_total_seed_tasks`
- `core.automation_db.AutomationTaskRepository.ensure_schema`
- `core.automation_db.AutomationTaskRepository.get_active_device_count`
- `core.automation_db.AutomationTaskRepository.get_good_product_daily_quota_status`
- `core.automation_db.AutomationTaskRepository.get_onebound_1688_item_get_response_by_num_iid`
- `core.automation_db.AutomationTaskRepository.get_source_1688_match`
- `core.automation_db.AutomationTaskRepository.get_user_id_by_username`
- `core.automation_db.AutomationTaskRepository.has_store_task`
- `core.automation_db.AutomationTaskRepository.heartbeat_owned_leases`
- `core.automation_db.AutomationTaskRepository.list_open_store_ids`
- `core.automation_db.AutomationTaskRepository.mark_good_skus_written`
- `core.automation_db.AutomationTaskRepository.mark_seed_done`
- `core.automation_db.AutomationTaskRepository.mark_store_done`
- `core.automation_db.AutomationTaskRepository.record_seed_task_failures`
- `core.automation_db.AutomationTaskRepository.refill_seed_tasks_from_seen`
- `core.automation_db.AutomationTaskRepository.release_owned_locks`
- `core.automation_db.AutomationTaskRepository.release_reserved_good_skus`
- `core.automation_db.AutomationTaskRepository.release_stale_locks`
- `core.automation_db.AutomationTaskRepository.release_stale_locks_coordinated`
- `core.automation_db.AutomationTaskRepository.reserve_good_sku`
- `core.automation_db.AutomationTaskRepository.reset_seed_tasks`

### PyInit 反汇编片段

```asm
0x180086690: lea rcx, [rip + 0x29539]
0x180086697: jmp qword ptr [rip + 0x18db2]
0x18008669e: int3
0x18008669f: int3
0x1800866a0: push rsi
0x1800866a2: sub rsp, 0x30
0x1800866a6: mov rsi, rcx
0x1800866a9: call qword ptr [rip + 0x18fc1]
0x1800866af: mov rcx, qword ptr [rax + 0x10]
0x1800866b3: call qword ptr [rip + 0x18a8f]
0x1800866b9: cmp rax, -1
0x1800866bd: je 0x18008670e
0x1800866bf: mov rdx, qword ptr [rip + 0x28efa]
0x1800866c6: cmp rdx, -1
0x1800866ca: jne 0x1800866f2
0x1800866cc: mov qword ptr [rip + 0x28eed], rax
0x1800866d3: mov rax, qword ptr [rip + 0x2ccce]
0x1800866da: test rax, rax
0x1800866dd: je 0x180086716
0x1800866df: mov ecx, dword ptr [rax]
0x1800866e1: add ecx, 1
0x1800866e4: je 0x1800867ed
0x1800866ea: mov dword ptr [rax], ecx
0x1800866ec: add rsp, 0x30
0x1800866f0: pop rsi
0x1800866f1: ret
0x1800866f2: cmp rdx, rax
0x1800866f5: je 0x1800866d3
0x1800866f7: mov rcx, qword ptr [rip + 0x18dea]
0x1800866fe: lea rdx, [rip + 0x1c97b]
0x180086705: mov rcx, qword ptr [rcx]
0x180086708: call qword ptr [rip + 0x18ae2]
0x18008670e: xor eax, eax
0x180086710: add rsp, 0x30
0x180086714: pop rsi
0x180086715: ret
0x180086716: mov qword ptr [rsp + 0x40], rbx
0x18008671b: lea rdx, [rip + 0x1965a]
0x180086722: mov qword ptr [rsp + 0x48], rbp
0x180086727: mov rcx, rsi
```

## excel_style_utils.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\core\excel_style_utils.cp312-win_amd64.pyd`
- 大小：45568 bytes
- 入口 RVA：`0x7294`
- 导出：`PyInit_excel_style_utils`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 27648 | 27640 | `0x60000020` |
| `.rdata` | 12288 | 11892 | `0x40000040` |
| `.data` | 2048 | 2712 | `0xc0000040` |
| `.pdata` | 1536 | 1536 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 224 | `0x42000040` |

### Imports

- `python312.dll`：`PyObject_GetAttr`, `PyModule_GetName`, `PyObject_HasAttr`, `_Py_NoneStruct`, `PyTuple_New`, `PyObject_GenericSetDict`, `PyDict_SetItemString`, `PyDict_Size`, `PyLong_FromLongLong`, `PyFloat_FromDouble`, `PyExc_AttributeError`, `PyTuple_GetSlice`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `Module 'excel_style_utils' has already been imported. Re-initialisation is not supported.`
- `PyInit_excel_style_utils`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `core/excel_style_utils.py`
- `core\excel_style_utils.c`
- `excel_style_utils.cp312-win_amd64.pyd`
- `init core.excel_style_utils`

### 可见函数/变量名

- `DisableThreadLibraryCalls`
- `E3E3Ht`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H3EH3H`
- `H98tcH`
- `H98tcHA`
- `HHHxyOHtH28`
- `HHt5LH`
- `HHt5LL`
- `HHtOLIH`
- `HHt_LH`
- `HIHIPHHt`
- `HIPIPPHt`
- `HO8DHM`
- `HULHUI`
- `HUMHUI`
- `HuPH5Y`
- `InitializeSListHead`
- `QueryPerformanceCounter`
- `SUWAUH`
- `SVWAUAVH`
- `UVWATAUAVAWH`
- `__C_specific_handler`
- `__annotations__`
- `__builtins__`
- `__closure__`
- `__code__`
- `__defaults__`
- `__dict__`
- `__doc__`
- `__file__`
- `__globals__`
- `__kwdefaults__`
- `__loader__`
- `__module__`
- `__name__`
- `__package__`
- `__path__`
- `__qualname__`
- `__reduce__`
- `__std_type_info_destroy_list`
- `__vectorcalloffset__`
- `__weaklistoffset__`
- `_cexit`
- `_configure_narrow_argv`
- `_cython_3_2_4`
- `_execute_onexit_table`
- `_initialize_narrow_environment`
- `_initialize_onexit_table`
- `_initterm`
- `_initterm_e`
- `_is_coroutine`
- `_seh_filter_dll`
- `apply_active_worksheet_header_style`
- `apply_header_cell_style`
- `apply_workbook_header_style`
- `apply_worksheet_header_style`
- `builtins`
- `cython_runtime`
- `decompress`
- `exactly`
- `excel_style_utils`
- `func_closure`
- `func_code`
- `func_defaults`
- `func_dict`
- `func_doc`
- `func_globals`
- `func_name`
- `loader`
- `memcmp`
- `memcpy`
- `memset`
- `ntelineI`
- `origin`
- `parent`
- `strrchr`
- `submodule_search_locations`

### Cython 符号

- `core.excel_style_utils`
- `core.excel_style_utils.apply_active_worksheet_header_style`
- `core.excel_style_utils.apply_header_cell_style`
- `core.excel_style_utils.apply_workbook_header_style`
- `core.excel_style_utils.apply_worksheet_header_style`

### PyInit 反汇编片段

```asm
0x1800029c0: lea rcx, [rip + 0x8c59]
0x1800029c7: jmp qword ptr [rip + 0x58aa]
0x1800029ce: int3
0x1800029cf: int3
0x1800029d0: push rsi
0x1800029d2: sub rsp, 0x30
0x1800029d6: mov rsi, rcx
0x1800029d9: call qword ptr [rip + 0x5a31]
0x1800029df: mov rcx, qword ptr [rax + 0x10]
0x1800029e3: call qword ptr [rip + 0x5807]
0x1800029e9: cmp rax, -1
0x1800029ed: je 0x180002a3e
0x1800029ef: mov rdx, qword ptr [rip + 0x8c02]
0x1800029f6: cmp rdx, -1
0x1800029fa: jne 0x180002a22
0x1800029fc: mov qword ptr [rip + 0x8bf5], rax
0x180002a03: mov rax, qword ptr [rip + 0x907e]
0x180002a0a: test rax, rax
0x180002a0d: je 0x180002a46
0x180002a0f: mov ecx, dword ptr [rax]
0x180002a11: add ecx, 1
0x180002a14: je 0x180002b1d
0x180002a1a: mov dword ptr [rax], ecx
0x180002a1c: add rsp, 0x30
0x180002a20: pop rsi
0x180002a21: ret
0x180002a22: cmp rdx, rax
0x180002a25: je 0x180002a03
0x180002a27: mov rcx, qword ptr [rip + 0x58ca]
0x180002a2e: lea rdx, [rip + 0x5c7b]
0x180002a35: mov rcx, qword ptr [rcx]
0x180002a38: call qword ptr [rip + 0x56da]
0x180002a3e: xor eax, eax
0x180002a40: add rsp, 0x30
0x180002a44: pop rsi
0x180002a45: ret
0x180002a46: mov qword ptr [rsp + 0x40], rbx
0x180002a4b: lea rdx, [rip + 0x5cbe]
0x180002a52: mov qword ptr [rsp + 0x48], rbp
0x180002a57: mov rcx, rsi
```

## model_api_key_store.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\core\model_api_key_store.cp312-win_amd64.pyd`
- 大小：61440 bytes
- 入口 RVA：`0xa2d4`
- 导出：`PyInit_model_api_key_store`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 40448 | 39992 | `0x60000020` |
| `.rdata` | 14848 | 14352 | `0x40000040` |
| `.data` | 2048 | 3152 | `0xc0000040` |
| `.pdata` | 2048 | 1992 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 256 | `0x42000040` |

### Imports

- `python312.dll`：`PyObject_GetAttr`, `PyModule_GetName`, `PyObject_HasAttr`, `PyErr_GetRaisedException`, `_Py_NoneStruct`, `PyTuple_New`, `PyObject_GenericSetDict`, `PyDict_SetItemString`, `PyDict_Size`, `PySet_Add`, `PyExc_AttributeError`, `PyTuple_GetSlice`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `    During a 1688 run:`
- `    Outside a 1688 run, keep default_order for compatibility.`
- `Model API key storage and resolution; Qwen only.`
- `Module 'model_api_key_store' has already been imported. Re-initialisation is not supported.`
- `PyInit_model_api_key_store`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `Return key priority for model calls.\n\n    False = user key from frontend/user_settings.\n    True = server admin key.\n\n    During a 1688 run:\n    - if the account allows admin key, use admin key only;\n    - otherwise use the local/fro`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `core/model_api_key_store.py`
- `core\model_api_key_store.c`
- `init core.model_api_key_store`
- `model_api_key_store.cp312-win_amd64.pyd`

### 可见函数/变量名

- `DisableThreadLibraryCalls`
- `E33E3U`
- `E33E3qE3E33gV`
- `E3LeMLuHUHcH`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H3EH3H`
- `H98tcH`
- `H98tcHA`
- `HHHxyOHtH28`
- `HHt5LH`
- `HHt5LL`
- `HHtOLIH`
- `HHt_LH`
- `HIHIPHHt`
- `HIPIPPHt`
- `HMHUAH`
- `HO8DHM`
- `HuHUHX`
- `InitializeSListHead`
- `LE3E3E3P`
- `LeHUHY`
- `LuHUHH`
- `LuHUHpK`
- `QueryPerformanceCounter`
- `Richv1`
- `SUWAUH`
- `SVWAUAVH`
- `UVWATAUAVAWH`
- `WHUE3I`
- `__C_specific_handler`
- `__annotations__`
- `__builtins__`
- `__closure__`
- `__code__`
- `__defaults__`
- `__dict__`
- `__doc__`
- `__file__`
- `__globals__`
- `__kwdefaults__`
- `__loader__`
- `__module__`
- `__name__`
- `__package__`
- `__path__`
- `__qualname__`
- `__reduce__`
- `__std_type_info_destroy_list`
- `__vectorcalloffset__`
- `__weaklistoffset__`
- `_cexit`
- `_configure_narrow_argv`
- `_cython_3_2_4`
- `_execute_onexit_table`
- `_initialize_narrow_environment`
- `_initialize_onexit_table`
- `_initterm`
- `_initterm_e`
- `_is_coroutine`
- `_provider_user_key_field`
- `_seh_filter_dll`
- `api_key`
- `builtins`
- `cython_runtime`
- `decompress`
- `exactly`
- `func_closure`
- `func_code`
- `func_defaults`
- `func_dict`
- `func_doc`
- `func_globals`
- `func_name`
- `load_user_model_api_key`
- `load_user_qwen_api_key`
- `loader`
- `memcmp`
- `memcpy`

### Cython 符号

- `core.model_api_key_store`
- `core.model_api_key_store._provider_user_key_field`
- `core.model_api_key_store.load_user_model_api_key`
- `core.model_api_key_store.load_user_qwen_api_key`
- `core.model_api_key_store.normalize_ai_provider`
- `core.model_api_key_store.resolve_1688_model_key_order`
- `core.model_api_key_store.resolve_1688_qwen_key_order`
- `core.model_api_key_store.resolve_model_api_key`
- `core.model_api_key_store.resolve_model_api_key_candidates`
- `core.model_api_key_store.resolve_qwen_api_key`
- `core.model_api_key_store.save_user_model_api_key`
- `core.model_api_key_store.save_user_qwen_api_key`

### PyInit 反汇编片段

```asm
0x180004bc0: lea rcx, [rip + 0xaa59]
0x180004bc7: jmp qword ptr [rip + 0x66c2]
0x180004bce: int3
0x180004bcf: int3
0x180004bd0: push rsi
0x180004bd2: sub rsp, 0x30
0x180004bd6: mov rsi, rcx
0x180004bd9: call qword ptr [rip + 0x6849]
0x180004bdf: mov rcx, qword ptr [rax + 0x10]
0x180004be3: call qword ptr [rip + 0x677f]
0x180004be9: cmp rax, -1
0x180004bed: je 0x180004c3e
0x180004bef: mov rdx, qword ptr [rip + 0xa9e2]
0x180004bf6: cmp rdx, -1
0x180004bfa: jne 0x180004c22
0x180004bfc: mov qword ptr [rip + 0xa9d5], rax
0x180004c03: mov rax, qword ptr [rip + 0xb036]
0x180004c0a: test rax, rax
0x180004c0d: je 0x180004c46
0x180004c0f: mov ecx, dword ptr [rax]
0x180004c11: add ecx, 1
0x180004c14: je 0x180004d1d
0x180004c1a: mov dword ptr [rax], ecx
0x180004c1c: add rsp, 0x30
0x180004c20: pop rsi
0x180004c21: ret
0x180004c22: cmp rdx, rax
0x180004c25: je 0x180004c03
0x180004c27: mov rcx, qword ptr [rip + 0x66da]
0x180004c2e: lea rdx, [rip + 0x6cdb]
0x180004c35: mov rcx, qword ptr [rcx]
0x180004c38: call qword ptr [rip + 0x64da]
0x180004c3e: xor eax, eax
0x180004c40: add rsp, 0x30
0x180004c44: pop rsi
0x180004c45: ret
0x180004c46: mov qword ptr [rsp + 0x40], rbx
0x180004c4b: lea rdx, [rip + 0x6d1e]
0x180004c52: mov qword ptr [rsp + 0x48], rbp
0x180004c57: mov rcx, rsi
```

## profit_rate_rules.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\core\profit_rate_rules.cp312-win_amd64.pyd`
- 大小：68608 bytes
- 入口 RVA：`0xc414`
- 导出：`PyInit_profit_rate_rules`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 48640 | 48504 | `0x60000020` |
| `.rdata` | 13824 | 13500 | `0x40000040` |
| `.data` | 2048 | 2928 | `0xc0000040` |
| `.pdata` | 2048 | 1692 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 240 | `0x42000040` |

### Imports

- `python312.dll`：`PyInterpreterState_GetID`, `PySet_Contains`, `PyObject_GetAttr`, `PyModule_GetName`, `PyFloat_AsDouble`, `PyObject_HasAttr`, `PyErr_GetRaisedException`, `_Py_NoneStruct`, `PyTuple_New`, `PyObject_GenericSetDict`, `PyDict_SetItemString`, `PyDict_Size`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `Module 'profit_rate_rules' has already been imported. Re-initialisation is not supported.`
- `PyInit_profit_rate_rules`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `core/profit_rate_rules.py`
- `core\profit_rate_rules.c`
- `init core.profit_rate_rules`
- `profit_rate_rules.cp312-win_amd64.pyd`

### 可见函数/变量名

- `DisableThreadLibraryCalls`
- `E3LmMLuHUHOo`
- `E3LmMLuHUHp`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H3EH3H`
- `H3HE3H`
- `H3HEHE`
- `H3HLXHt`
- `H98tcH`
- `H98tcHA`
- `HHHxyOHtH28`
- `HHt5LH`
- `HHt5LL`
- `HHtOLIH`
- `HHt_LH`
- `HIHIPHHt`
- `HIPIPPHt`
- `HMwE3Ht`
- `HO8DHM`
- `HuCH5b`
- `HuHUIpa`
- `HuHUIz`
- `InitializeSListHead`
- `LUSIXH`
- `LuHUHX`
- `LuHUIX`
- `LuHUI_`
- `LuHUIo`
- `QueryPerformanceCounter`
- `SUWAUH`
- `SVWAUAVH`
- `USAWHhH`
- `USVWATAUAVAWH`
- `USVWATAVAWH`
- `USVWAVAWH`
- `USVWAVH`
- `UVWATAUAVAWH`
- `WHUE3I`
- `__C_specific_handler`
- `__annotations__`
- `__builtins__`
- `__closure__`
- `__code__`
- `__defaults__`
- `__dict__`
- `__doc__`
- `__file__`
- `__globals__`
- `__kwdefaults__`
- `__loader__`
- `__module__`
- `__name__`
- `__package__`
- `__path__`
- `__qualname__`
- `__reduce__`
- `__std_type_info_destroy_list`
- `__vectorcalloffset__`
- `__weaklistoffset__`
- `_cexit`
- `_configure_narrow_argv`
- `_cython_3_2_4`
- `_execute_onexit_table`
- `_initialize_narrow_environment`
- `_initialize_onexit_table`
- `_initterm`
- `_initterm_e`
- `_is_coroutine`
- `_seh_filter_dll`
- `bhsmeD`
- `builtins`
- `calculate_profit`
- `calculate_profit_rate`
- `calculate_purchase_amount_for_target_profit_rate`
- `calculate_sale_price_for_target_profit_rate`
- `cython_runtime`
- `decompress`
- `exactly`

### Cython 符号

- `core.profit_rate_rules`
- `core.profit_rate_rules.calculate_profit`
- `core.profit_rate_rules.calculate_profit_rate`
- `core.profit_rate_rules.calculate_purchase_amount_for_target_profit_rate`
- `core.profit_rate_rules.calculate_sale_price_for_target_profit_rate`
- `core.profit_rate_rules.normalize_profit_rate_rule`
- `core.profit_rate_rules.rule_by_ozon_price`
- `core.profit_rate_rules.rule_by_total_cost`
- `core.profit_rate_rules.rule_by_total_cost_with_commission`

### PyInit 反汇编片段

```asm
0x180007300: lea rcx, [rip + 0xa319]
0x180007307: jmp qword ptr [rip + 0x5fba]
0x18000730e: int3
0x18000730f: int3
0x180007310: push rsi
0x180007312: sub rsp, 0x30
0x180007316: mov rsi, rcx
0x180007319: call qword ptr [rip + 0x6131]
0x18000731f: mov rcx, qword ptr [rax + 0x10]
0x180007323: call qword ptr [rip + 0x5d8f]
0x180007329: cmp rax, -1
0x18000732d: je 0x18000737e
0x18000732f: mov rdx, qword ptr [rip + 0xa2c2]
0x180007336: cmp rdx, -1
0x18000733a: jne 0x180007362
0x18000733c: mov qword ptr [rip + 0xa2b5], rax
0x180007343: mov rax, qword ptr [rip + 0xa816]
0x18000734a: test rax, rax
0x18000734d: je 0x180007386
0x18000734f: mov ecx, dword ptr [rax]
0x180007351: add ecx, 1
0x180007354: je 0x18000745d
0x18000735a: mov dword ptr [rax], ecx
0x18000735c: add rsp, 0x30
0x180007360: pop rsi
0x180007361: ret
0x180007362: cmp rdx, rax
0x180007365: je 0x180007343
0x180007367: mov rcx, qword ptr [rip + 0x5fca]
0x18000736e: lea rdx, [rip + 0x650b]
0x180007375: mov rcx, qword ptr [rcx]
0x180007378: call qword ptr [rip + 0x5dc2]
0x18000737e: xor eax, eax
0x180007380: add rsp, 0x30
0x180007384: pop rsi
0x180007385: ret
0x180007386: mov qword ptr [rsp + 0x40], rbx
0x18000738b: lea rdx, [rip + 0x654e]
0x180007392: mov qword ptr [rsp + 0x48], rbp
0x180007397: mov rcx, rsi
```

## runtime_profile.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\core\runtime_profile.cp312-win_amd64.pyd`
- 大小：48640 bytes
- 入口 RVA：`0x7234`
- 导出：`PyInit_runtime_profile`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 27648 | 27544 | `0x60000020` |
| `.rdata` | 13824 | 13654 | `0x40000040` |
| `.data` | 3072 | 4168 | `0xc0000040` |
| `.pdata` | 2048 | 1872 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 304 | `0x42000040` |

### Imports

- `python312.dll`：`PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`, `PyObject_Hash`, `PyNumber_Xor`, `PyExc_UnboundLocalError`, `PyErr_SetNone`, `PyDict_GetItemWithError`, `PyInterpreterState_GetID`, `PyObject_GetAttr`
- `KERNEL32.dll`：`QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `DisableThreadLibraryCalls`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`strrchr`, `__C_specific_handler`, `__std_type_info_destroy_list`, `memset`, `memcpy`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initterm`, `_execute_onexit_table`, `_cexit`, `_initialize_onexit_table`

### 业务关键词字符串

- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`

### 可见函数/变量名

- `DHMHHt`
- `DisableThreadLibraryCalls`
- `EEegkmf`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H3EH3H`
- `HE0HXH`
- `HEhLIF`
- `HH9Upu`
- `HHHhH9`
- `HHHxyOHtH28`
- `HHLuhW`
- `HHMh3I`
- `HHt4LL`
- `HHt5LH`
- `HHtOLIH`
- `HHt_LH`
- `HIHIPHHt`
- `HIPIPPHt`
- `IFhHL0H8Mt`
- `IFhL0H8Ht`
- `InitializeSListHead`
- `MHIIHt`
- `MHMHHt`
- `MHteHo`
- `QueryPerformanceCounter`
- `SUWAUH`
- `SVWAUAVH`
- `WHcIH43H`
- `XrKjIuA`
- `__C_specific_handler`
- `__annotations__`
- `__builtins__`
- `__closure__`
- `__code__`
- `__defaults__`
- `__dict__`
- `__doc__`
- `__file__`
- `__globals__`
- `__kwdefaults__`
- `__loader__`
- `__module__`
- `__name__`
- `__package__`
- `__path__`
- `__qualname__`
- `__reduce__`
- `__reduce_ex__`
- `__std_type_info_destroy_list`
- `__vectorcalloffset__`
- `__weaklistoffset__`
- `_cexit`
- `_configure_narrow_argv`
- `_cython_3_2_4`
- `_execute_onexit_table`
- `_initialize_narrow_environment`
- `_initialize_onexit_table`
- `_initterm`
- `_initterm_e`
- `_is_coroutine`
- `_seh_filter_dll`
- `builtins`
- `cython_runtime`
- `decompress`
- `func_closure`
- `func_code`
- `func_defaults`
- `func_dict`
- `func_doc`
- `func_globals`
- `func_name`
- `genexpr`
- `gi_code`
- `gi_frame`
- `gi_running`
- `gi_yieldfrom`
- `loader`
- `memcpy`

### Cython 符号

- `core.runtime_profile`
- `core.runtime_profile.__pyx_scope_struct__genexpr`
- `core.runtime_profile.read_primary_token`
- `core.runtime_profile.read_primary_token.genexpr`

### PyInit 反汇编片段

```asm
0x180001e00: lea rcx, [rip + 0xaac9]
0x180001e07: jmp qword ptr [rip + 0x64ca]
0x180001e0e: int3
0x180001e0f: int3
0x180001e10: push rsi
0x180001e12: sub rsp, 0x30
0x180001e16: mov rsi, rcx
0x180001e19: call qword ptr [rip + 0x6641]
0x180001e1f: mov rcx, qword ptr [rax + 0x10]
0x180001e23: call qword ptr [rip + 0x62d7]
0x180001e29: cmp rax, -1
0x180001e2d: je 0x180001e7e
0x180001e2f: mov rdx, qword ptr [rip + 0xaa8a]
0x180001e36: cmp rdx, -1
0x180001e3a: jne 0x180001e62
0x180001e3c: mov qword ptr [rip + 0xaa7d], rax
0x180001e43: mov rax, qword ptr [rip + 0xb1ee]
0x180001e4a: test rax, rax
0x180001e4d: je 0x180001e86
0x180001e4f: mov ecx, dword ptr [rax]
0x180001e51: add ecx, 1
0x180001e54: je 0x180001f5d
0x180001e5a: mov dword ptr [rax], ecx
0x180001e5c: add rsp, 0x30
0x180001e60: pop rsi
0x180001e61: ret
0x180001e62: cmp rdx, rax
0x180001e65: je 0x180001e43
0x180001e67: mov rcx, qword ptr [rip + 0x64d2]
0x180001e6e: lea rdx, [rip + 0x67cb]
0x180001e75: mov rcx, qword ptr [rcx]
0x180001e78: call qword ptr [rip + 0x62da]
0x180001e7e: xor eax, eax
0x180001e80: add rsp, 0x30
0x180001e84: pop rsi
0x180001e85: ret
0x180001e86: mov qword ptr [rsp + 0x40], rbx
0x180001e8b: lea rdx, [rip + 0x680e]
0x180001e92: mov qword ptr [rsp + 0x48], rbp
0x180001e97: mov rcx, rsi
```

## userdata_paths.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\core\userdata_paths.cp312-win_amd64.pyd`
- 大小：84480 bytes
- 入口 RVA：`0xf7c4`
- 导出：`PyInit_userdata_paths`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 61952 | 61736 | `0x60000020` |
| `.rdata` | 15360 | 15244 | `0x40000040` |
| `.data` | 2560 | 3608 | `0xc0000040` |
| `.pdata` | 2560 | 2208 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 272 | `0x42000040` |

### Imports

- `python312.dll`：`PyUnicode_Concat`, `PyDict_GetItemWithError`, `PyInterpreterState_GetID`, `PyObject_GetAttr`, `PyModule_GetName`, `PyObject_HasAttr`, `PyErr_GetRaisedException`, `_Py_NoneStruct`, `PyTuple_New`, `PyObject_GenericSetDict`, `PyDict_SetItemString`, `PyDict_Size`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`

### 可见函数/变量名

- `DisableThreadLibraryCalls`
- `E3E3E3H5`
- `E3HuZH5o`
- `EHHhHt`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H3EH3H`
- `H98tcH`
- `H98tcHA`
- `HE8Hu0`
- `HEHHhH1HuHt`
- `HEHHhL9Mt`
- `HEXLuP`
- `HHHxyOHtH28`
- `HHMxH37`
- `HHt5LH`
- `HHt5LL`
- `HHt6LA9`
- `HHt9HP`
- `HHtOLIH`
- `HHt_LH`
- `HHto6H`
- `HHuEH5B`
- `HIHIPHHt`
- `HIPIPPHt`
- `HO8DHM`
- `HUE3LmMHE`
- `HUE3LuMHE`
- `HuE3HHk`
- `HuHuLmIK`
- `IGhHUH`
- `ILE3FB`
- `InitializeSListHead`
- `LHtOHH`
- `LUWIXH`
- `LmIHELLmM`
- `QueryPerformanceCounter`
- `SUVWATAUAVAWH`
- `SUVWATAUAVAWHHH`
- `SUWAUH`
- `SVWAUAVH`
- `USVWATAUAVAWH`
- `UVWATAUAVAWH`
- `VWATAVAWH`
- `__C_specific_handler`
- `__annotations__`
- `__builtins__`
- `__closure__`
- `__code__`
- `__defaults__`
- `__dict__`
- `__doc__`
- `__file__`
- `__globals__`
- `__kwdefaults__`
- `__loader__`
- `__module__`
- `__name__`
- `__package__`
- `__path__`
- `__qualname__`
- `__reduce__`
- `__std_type_info_destroy_list`
- `__vectorcalloffset__`
- `__weaklistoffset__`
- `_cexit`
- `_configure_narrow_argv`
- `_cython_3_2_4`
- `_execute_onexit_table`
- `_initialize_narrow_environment`
- `_initialize_onexit_table`
- `_initterm`
- `_initterm_e`
- `_is_coroutine`
- `_move_path_if_needed`
- `_ozon_cache_root_for`
- `_resolve_app_root`
- `_seh_filter_dll`

### Cython 符号

- `core.userdata_paths`
- `core.userdata_paths._move_path_if_needed`
- `core.userdata_paths._ozon_cache_root_for`
- `core.userdata_paths._resolve_app_root`
- `core.userdata_paths._source_1688_cache_root_for`
- `core.userdata_paths._userdata_root_for`
- `core.userdata_paths.ensure_userdata_layout`
- `core.userdata_paths.get_1688_cache_root`
- `core.userdata_paths.get_1688_detail_worker_user_data_dir`
- `core.userdata_paths.get_1688_login_state_path`
- `core.userdata_paths.get_1688_user_data_dir`
- `core.userdata_paths.get_1688_worker_user_data_dir`
- `core.userdata_paths.get_application_root`
- `core.userdata_paths.get_ozon_cache_root`
- `core.userdata_paths.get_ozon_product_worker_user_data_dir`
- `core.userdata_paths.get_ozon_user_data_dir`
- `core.userdata_paths.get_userdata_root`

### PyInit 反汇编片段

```asm
0x180009680: lea rcx, [rip + 0xc059]
0x180009687: jmp qword ptr [rip + 0x7c22]
0x18000968e: int3
0x18000968f: int3
0x180009690: push rsi
0x180009692: sub rsp, 0x30
0x180009696: mov rsi, rcx
0x180009699: call qword ptr [rip + 0x7dc1]
0x18000969f: mov rcx, qword ptr [rax + 0x10]
0x1800096a3: call qword ptr [rip + 0x7a1f]
0x1800096a9: cmp rax, -1
0x1800096ad: je 0x1800096fe
0x1800096af: mov rdx, qword ptr [rip + 0xbfa2]
0x1800096b6: cmp rdx, -1
0x1800096ba: jne 0x1800096e2
0x1800096bc: mov qword ptr [rip + 0xbf95], rax
0x1800096c3: mov rax, qword ptr [rip + 0xc73e]
0x1800096ca: test rax, rax
0x1800096cd: je 0x180009706
0x1800096cf: mov ecx, dword ptr [rax]
0x1800096d1: add ecx, 1
0x1800096d4: je 0x1800097dd
0x1800096da: mov dword ptr [rax], ecx
0x1800096dc: add rsp, 0x30
0x1800096e0: pop rsi
0x1800096e1: ret
0x1800096e2: cmp rdx, rax
0x1800096e5: je 0x1800096c3
0x1800096e7: mov rcx, qword ptr [rip + 0x7c42]
0x1800096ee: lea rdx, [rip + 0x835b]
0x1800096f5: mov rcx, qword ptr [rcx]
0x1800096f8: call qword ptr [rip + 0x7a2a]
0x1800096fe: xor eax, eax
0x180009700: add rsp, 0x30
0x180009704: pop rsi
0x180009705: ret
0x180009706: mov qword ptr [rsp + 0x40], rbx
0x18000970b: lea rdx, [rip + 0x839e]
0x180009712: mov qword ptr [rsp + 0x48], rbp
0x180009717: mov rcx, rsi
```

## utils.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\core\utils.cp312-win_amd64.pyd`
- 大小：245760 bytes
- 入口 RVA：`0x319d4`
- 导出：`PyInit_utils`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 201728 | 201528 | `0x60000020` |
| `.rdata` | 30720 | 30478 | `0x40000040` |
| `.data` | 6144 | 11008 | `0xc0000040` |
| `.pdata` | 4608 | 4440 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 1024 | 516 | `0x42000040` |

### Imports

- `python312.dll`：`PyUnicode_DecodeUTF8`, `PyList_Sort`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`, `PyObject_Hash`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 数据库/状态线索

- ` state.log_queue`
- `通用日志函数\n    将消息推送到 state.log_queue`

### 业务关键词字符串

- ` C API `
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `Write non-error diagnostic logs for the 1688 image-search pipeline.`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `利用底层 C API 向指定线程异步抛出异常`

### 可见函数/变量名

- `AHHLII`
- `ATAUHHyp`
- `BMYiW8j`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E33E3H`
- `E33E3IF`
- `E3E33IAk`
- `E3E3H5`
- `E3HEIH`
- `E3HEMH`
- `E3HEgd`
- `E3HuHI`
- `E3HupLLmxIH`
- `E3LEHH8`
- `E3LuoHt`
- `Et_HyZH`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H3E3E3`
- `H3EH3H`
- `H3HE8H`
- `H3HEIs`
- `H3HLHt`
- `HE0HXH`
- `HE3HELe`
- `HE8HO8`
- `HEHEHE`
- `HEHEHEH`
- `HEHEHEX`
- `HEHEMt`
- `HEHHhH9Ht`
- `HEHHhf`
- `HEHLHu`
- `HEHUhE3HEpA`
- `HEHUpH`
- `HEHuLeLm3E3E3E3Ht`
- `HEHuYLF`
- `HELLEIHHE`
- `HELMHE`
- `HELmLe`
- `HEMLHEIH`
- `HEMMHEIH`
- `HEX3HEpHuP`
- `HEg3Lu`
- `HEgE3Lu`
- `HEgHEwHu`
- `HEgHHu`
- `HEgMHEgDH`
- `HEh33L0H0Mt`
- `HEhL0H0Ht`
- `HEhLIF`
- `HH9Upu`
- `HHEEHE`
- `HHHhH9`
- `HHHxyOHtH28`
- `HHLuhW`
- `HHM8H3`
- `HHM8H3q`
- `HHMh3I`
- `HHhfff`
- `HHt5LH`
- `HHt6LL`
- `HHt9HP`
- `HHtOLIH`
- `HHt_LH`
- `HHto6H`
- `HHu0L5`
- `HHu23C`
- `HHu6L5m`
- `HIHIPHHt`
- `HIPIPPHt`
- `HM0HtT9`
- `HMHHuHt`
- `HMHtm9`
- `HMILuLmHt`
- `HML0HEHt`

### Cython 符号

- `core.utils`
- `core.utils.__pyx_scope_struct_1__is_protected_desktop_shell_edge_process`
- `core.utils.__pyx_scope_struct_2_genexpr`
- `core.utils.__pyx_scope_struct_3_genexpr`
- `core.utils.__pyx_scope_struct_4_is_expected_driver_shutdown_error`
- `core.utils.__pyx_scope_struct_5_genexpr`
- `core.utils.__pyx_scope_struct__genexpr`
- `core.utils._async_raise`
- `core.utils._format_debug_log_value`
- `core.utils._get_connection_local_address`
- `core.utils._get_exception_logger`
- `core.utils._get_protected_desktop_shell_edge_pids`
- `core.utils._get_source_1688_debug_logger`
- `core.utils._is_protected_desktop_shell_edge_process`
- `core.utils._is_protected_desktop_shell_edge_process.genexpr`
- `core.utils._kill_process_tree`
- `core.utils._normalize_currency_code`
- `core.utils._normalize_price_number_token`
- `core.utils._resolve_log_dir`
- `core.utils._target_hosts_for_port_scan`
- `core.utils.format_port_processes`
- `core.utils.get_exception_log_path`
- `core.utils.get_listening_processes_using_port`
- `core.utils.get_rub_to_cny_rate`
- `core.utils.get_source_1688_debug_log_path`
- `core.utils.infer_ozon_currency_hint`
- `core.utils.infer_ozon_currency_hint.lambda4`
- `core.utils.is_expected_driver_shutdown_error`
- `core.utils.is_expected_driver_shutdown_error.genexpr`
- `core.utils.is_own_desktop_backend_process`
- `core.utils.is_own_desktop_backend_process.genexpr`
- `core.utils.kill_edge_processes`
- `core.utils.kill_own_processes_using_port`
- `core.utils.kill_processes_using_port`
- `core.utils.log_1688_debug`
- `core.utils.log_exception`
- `core.utils.normalize_ozon_price_to_cny`
- `core.utils.parse_ozon_price_amount_and_currency`
- `core.utils.parse_ozon_price_amount_and_currency.lambda5`
- `core.utils.safe_float`
- `core.utils.sanitize_ui_log_message`
- `core.utils.ui_log`
- `core.utils.wait_for_port_release`

### PyInit 反汇编片段

```asm
0x180025c20: lea rcx, [rip + 0x16329]
0x180025c27: jmp qword ptr [rip + 0xd802]
0x180025c2e: int3
0x180025c2f: int3
0x180025c30: push rsi
0x180025c32: sub rsp, 0x30
0x180025c36: mov rsi, rcx
0x180025c39: call qword ptr [rip + 0xda09]
0x180025c3f: mov rcx, qword ptr [rax + 0x10]
0x180025c43: call qword ptr [rip + 0xd4ef]
0x180025c49: cmp rax, -1
0x180025c4d: je 0x180025c9e
0x180025c4f: mov rdx, qword ptr [rip + 0x161ea]
0x180025c56: cmp rdx, -1
0x180025c5a: jne 0x180025c82
0x180025c5c: mov qword ptr [rip + 0x161dd], rax
0x180025c63: mov rax, qword ptr [rip + 0x17e86]
0x180025c6a: test rax, rax
0x180025c6d: je 0x180025ca6
0x180025c6f: mov ecx, dword ptr [rax]
0x180025c71: add ecx, 1
0x180025c74: je 0x180025d7d
0x180025c7a: mov dword ptr [rax], ecx
0x180025c7c: add rsp, 0x30
0x180025c80: pop rsi
0x180025c81: ret
0x180025c82: cmp rdx, rax
0x180025c85: je 0x180025c63
0x180025c87: mov rcx, qword ptr [rip + 0xd83a]
0x180025c8e: lea rdx, [rip + 0xe62b]
0x180025c95: mov rcx, qword ptr [rcx]
0x180025c98: call qword ptr [rip + 0xd552]
0x180025c9e: xor eax, eax
0x180025ca0: add rsp, 0x30
0x180025ca4: pop rsi
0x180025ca5: ret
0x180025ca6: mov qword ptr [rsp + 0x40], rbx
0x180025cab: lea rdx, [rip + 0xe66e]
0x180025cb2: mov qword ptr [rsp + 0x48], rbp
0x180025cb7: mov rcx, rsi
```

## excel_dao.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\dao\excel_dao.cp312-win_amd64.pyd`
- 大小：294400 bytes
- 入口 RVA：`0x3d6d4`
- 导出：`PyInit_excel_dao`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 250368 | 250008 | `0x60000020` |
| `.rdata` | 32768 | 32312 | `0x40000040` |
| `.data` | 4608 | 10016 | `0xc0000040` |
| `.pdata` | 4608 | 4308 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 452 | `0x42000040` |

### Imports

- `python312.dll`：`PyArg_ValidateKeywordArguments`, `PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyNumber_Absolute`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `.Vg,XAaPi5;N{H`
- `Excel `
- `Excel 数据读写访问层`
- `Module 'excel_dao' has already been imported. Re-initialisation is not supported.`
- `PyInit_excel_dao`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `dao/excel_dao.py`
- `dao\excel_dao.c`
- `excel_dao.cp312-win_amd64.pyd`
- `init dao.excel_dao`

### 可见函数/变量名

- `AHHLII`
- `AHMH5HMH`
- `AMkALP`
- `BtKHgBHHA`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E333L59M`
- `E33E39`
- `E33E3E3n`
- `E33E3wo`
- `E33HeM`
- `E3E33H`
- `E3E33HL`
- `E3E33j`
- `E3EAHH`
- `E3HEt_`
- `E3HuHHE`
- `E3LMLEIHUAIy`
- `E3LeMLuHUHU`
- `E3rE3o`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H3EH3H`
- `H3HEPH`
- `H3HLHt`
- `H3HLXHt`
- `H8tOHB9HH8L`
- `H98tcH`
- `H98tcHA`
- `HChE33H`
- `HE0HXH`
- `HE0LHu`
- `HE33E3E3`
- `HE3E3E3`
- `HE3HEHE`
- `HEE3Lm`
- `HEHEHN0`
- `HEHHEhH`
- `HEHHMHHt`
- `HEHHhH`
- `HEHUE3HEA`
- `HEHuBH5`
- `HEh33L8H0Mt`
- `HEhL8H0Ht`
- `HEhLIF`
- `HFhHUH`
- `HH9Upu`
- `HHELMLE`
- `HHHhH9`
- `HHHxyOHtH28`
- `HHLuhW`
- `HHMHHHt`
- `HHMh3I`
- `HHMhH38`
- `HHU83A9u`
- `HHt5LH`
- `HHt5LL`
- `HHt9HP`
- `HHtOLIH`
- `HHt_LH`
- `HHto6H`
- `HHuAL5`
- `HHuHUH`
- `HIHIPHHt`
- `HIPIPPHt`
- `HM1HMt`
- `HM3Hu9`
- `HME3LuH`
- `HMHHMH`
- `HMHuHt`
- `HMIHuHt`
- `HMILuHt`
- `HMLmHt`
- `HMUHMH`
- `HO8DHM`
- `HUE3HEA`
- `HUE3HEI`

### Cython 符号

- `dao.excel_dao`
- `dao.excel_dao.__pyx_scope_struct_1_genexpr`
- `dao.excel_dao.__pyx_scope_struct___normalize_product_sheet`
- `dao.excel_dao._add_resized_image_from_url`
- `dao.excel_dao._build_column_letter_map`
- `dao.excel_dao._build_required_headers`
- `dao.excel_dao._calculate_suggest_purchase_price`
- `dao.excel_dao._calculate_suggested_sale_price_for_auto_listing`
- `dao.excel_dao._delete_column_by_header`
- `dao.excel_dao._ensure_required_headers`
- `dao.excel_dao._find_dynamic_suggested_sale_headers`
- `dao.excel_dao._format_profit_rate_pct_for_header`
- `dao.excel_dao._format_rate_for_formula`
- `dao.excel_dao._get_current_headers`
- `dao.excel_dao._get_misc_fee_rate`
- `dao.excel_dao._get_profit_rate_rule`
- `dao.excel_dao._get_suggested_sale_header`
- `dao.excel_dao._get_target_profit_rate`
- `dao.excel_dao._insert_missing_headers_after`
- `dao.excel_dao._normalize_product_sheet`
- `dao.excel_dao._normalize_product_sheet.genexpr`
- `dao.excel_dao._normalize_shop_names_for_excel`
- `dao.excel_dao._normalize_sku_text`
- `dao.excel_dao._rename_header`
- `dao.excel_dao._reset_headers_for_empty_sheet`
- `dao.excel_dao._resolve_auto_listing_price`
- `dao.excel_dao._run_auto_listing_for_item`
- `dao.excel_dao._set_image_fallback_value`
- `dao.excel_dao._style_excel_file_headers`
- `dao.excel_dao.download_image_with_retry`
- `dao.excel_dao.flush_buffer_to_excel`
- `dao.excel_dao.flush_store_buffer_to_excel`
- `dao.excel_dao.safe_save_workbook`

### PyInit 反汇编片段

```asm
0x180031d90: lea rcx, [rip + 0x16079]
0x180031d97: jmp qword ptr [rip + 0xd6aa]
0x180031d9e: int3
0x180031d9f: int3
0x180031da0: push rsi
0x180031da2: sub rsp, 0x30
0x180031da6: mov rsi, rcx
0x180031da9: call qword ptr [rip + 0xd8b1]
0x180031daf: mov rcx, qword ptr [rax + 0x10]
0x180031db3: call qword ptr [rip + 0xd38f]
0x180031db9: cmp rax, -1
0x180031dbd: je 0x180031e0e
0x180031dbf: mov rdx, qword ptr [rip + 0x15f9a]
0x180031dc6: cmp rdx, -1
0x180031dca: jne 0x180031df2
0x180031dcc: mov qword ptr [rip + 0x15f8d], rax
0x180031dd3: mov rax, qword ptr [rip + 0x17936]
0x180031dda: test rax, rax
0x180031ddd: je 0x180031e16
0x180031ddf: mov ecx, dword ptr [rax]
0x180031de1: add ecx, 1
0x180031de4: je 0x180031eed
0x180031dea: mov dword ptr [rax], ecx
0x180031dec: add rsp, 0x30
0x180031df0: pop rsi
0x180031df1: ret
0x180031df2: cmp rdx, rax
0x180031df5: je 0x180031dd3
0x180031df7: mov rcx, qword ptr [rip + 0xd6ea]
0x180031dfe: lea rdx, [rip + 0xe34b]
0x180031e05: mov rcx, qword ptr [rcx]
0x180031e08: call qword ptr [rip + 0xd3f2]
0x180031e0e: xor eax, eax
0x180031e10: add rsp, 0x30
0x180031e14: pop rsi
0x180031e15: ret
0x180031e16: mov qword ptr [rsp + 0x40], rbx
0x180031e1b: lea rdx, [rip + 0xe38e]
0x180031e22: mov qword ptr [rsp + 0x48], rbp
0x180031e27: mov rcx, rsi
```

## ai_inquiry_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\ai_inquiry_service.cp312-win_amd64.pyd`
- 大小：386048 bytes
- 入口 RVA：`0x505d4`
- 导出：`PyInit_ai_inquiry_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 327680 | 327480 | `0x60000020` |
| `.rdata` | 40960 | 40800 | `0x40000040` |
| `.data` | 8704 | 15384 | `0xc0000040` |
| `.pdata` | 6144 | 5988 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 1024 | 620 | `0x42000040` |

### Imports

- `python312.dll`：`PyErr_Occurred`, `PyArg_ValidateKeywordArguments`, `PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `Module 'ai_inquiry_service' has already been imported. Re-initialisation is not supported.`
- `PyInit_ai_inquiry_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `ai_inquiry_service.cp312-win_amd64.pyd`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `init services.ai_inquiry_service`
- `services/ai_inquiry_service.py`
- `services\ai_inquiry_service.c`

### 可见函数/变量名

- `AHHLII`
- `CythonUnboundCMethod`
- `DDHEDHEHEDH`
- `DLhDLp`
- `DisableThreadLibraryCalls`
- `E333E3Mt`
- `E33LuE3`
- `E3AH9C`
- `E3E335`
- `E3E33H`
- `E3E3E3`
- `E3E3HE30`
- `E3HEHHH`
- `E3HEXH`
- `E3Hu0LH`
- `E3IEhH`
- `E3L55e`
- `E3LHELe`
- `E3LLeXLePLeHt`
- `E3LeHUHuHSl`
- `E3LeMHuHUH`
- `E3LmLHuHUH6`
- `E3LmMt`
- `E3LuIHu`
- `E3MLeDApHLUELUXAEEE`
- `EE3LmLu`
- `FHAHt28`
- `GHGpHH`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H1HuHt`
- `H2HEoHUE3HEI`
- `H3EH3H`
- `H3HE0H`
- `H3HE8H`
- `H3HEHE`
- `H3HEIs`
- `H3HLHt`
- `H3HLPHt`
- `H3HLXHt`
- `H98tcH`
- `H98tcHA`
- `HChE33H`
- `HE03HE8`
- `HE3HMDH`
- `HEE3HL`
- `HEE3IH`
- `HEHEHEH`
- `HEHEHEHHEHHt`
- `HEHEHx`
- `HEHEMs`
- `HEHHEH`
- `HEHHhf`
- `HEHHhfH1Ht`
- `HEHHup`
- `HEHHus`
- `HEHLHu`
- `HEHUE3HEA`
- `HEHUE3HEI`
- `HEHUhH`
- `HELHHt`
- `HELmHHt`
- `HEMHLG1`
- `HEPHEhH`
- `HEgE3LH`
- `HEgMMI`
- `HEgMMIJ`
- `HEgMMIUH`
- `HEh33L0H0Mt`
- `HEhL0H0Ht`
- `HEhLIF`
- `HEoE3H`
- `HEoHUE3HEA`
- `HEpHEH`
- `HEpLmh`
- `HGhE3LeHuwH8H03HEHEHt`
- `HH9Upu`
- `HHEHHhff`

### Cython 符号

- `services.ai_inquiry_service`
- `services.ai_inquiry_service.__defaults__`
- `services.ai_inquiry_service.__pyx_defaults`
- `services.ai_inquiry_service.__pyx_scope_struct_1__iter_source_sku_records`
- `services.ai_inquiry_service.__pyx_scope_struct_2_genexpr`
- `services.ai_inquiry_service.__pyx_scope_struct_3_genexpr`
- `services.ai_inquiry_service.__pyx_scope_struct_4_extract_integrated_size_info_for_source_sku`
- `services.ai_inquiry_service.__pyx_scope_struct_5_genexpr`
- `services.ai_inquiry_service.__pyx_scope_struct_6__send_ai_inquiry_image_paths`
- `services.ai_inquiry_service.__pyx_scope_struct_7_send_ai_inquiry_messages`
- `services.ai_inquiry_service.__pyx_scope_struct_8__switch_to_ai_inquiry_chat_context`
- `services.ai_inquiry_service.__pyx_scope_struct___iter_dict_values`
- `services.ai_inquiry_service._cache_workbook_images_for_repeated_save`
- `services.ai_inquiry_service._cache_workbook_images_for_repeated_save.lambda2`
- `services.ai_inquiry_service._collect_candidate_texts`
- `services.ai_inquiry_service._collect_seller_ids`
- `services.ai_inquiry_service._create_inquiry_driver`
- `services.ai_inquiry_service._extract_seller_ids_from_text`
- `services.ai_inquiry_service._first_text`
- `services.ai_inquiry_service._guess_image_suffix`
- `services.ai_inquiry_service._is_missing_merchant_login_error`
- `services.ai_inquiry_service._iter_dict_values`
- `services.ai_inquiry_service._iter_source_sku_records`
- `services.ai_inquiry_service._iter_source_sku_records.genexpr`
- `services.ai_inquiry_service._loads_response_json`
- `services.ai_inquiry_service._log`
- `services.ai_inquiry_service._normalize_text`
- `services.ai_inquiry_service._quit_driver`
- `services.ai_inquiry_service._send_ai_inquiry_image_paths`
- `services.ai_inquiry_service._send_ai_inquiry_image_paths.lambda4`
- `services.ai_inquiry_service._sleep_with_stop`
- `services.ai_inquiry_service._split_property_codes`
- `services.ai_inquiry_service._switch_to_ai_inquiry_chat_context`
- `services.ai_inquiry_service._switch_to_ai_inquiry_chat_context.frame_priority`
- `services.ai_inquiry_service._switch_to_ai_inquiry_chat_context.lambda5`
- `services.ai_inquiry_service.build_ai_inquiry_delivery_steps`
- `services.ai_inquiry_service.build_ai_inquiry_im_url`
- `services.ai_inquiry_service.build_batch_inquiry_message`
- `services.ai_inquiry_service.build_first_inquiry_message`
- `services.ai_inquiry_service.build_source_sku_title_from_properties`
- `services.ai_inquiry_service.build_source_sku_title_from_properties.genexpr`
- `services.ai_inquiry_service.build_source_value`
- `services.ai_inquiry_service.download_inquiry_image`
- `services.ai_inquiry_service.ensure_excel_writable`
- `services.ai_inquiry_service.extract_integrated_size_info_for_source_sku`
- `services.ai_inquiry_service.extract_integrated_size_info_for_source_sku.matches_entry`
- `services.ai_inquiry_service.extract_integrated_size_info_for_source_sku.matches_entry.genexpr`
- `services.ai_inquiry_service.extract_integrated_size_info_for_source_sku.stringify_entry`
- `services.ai_inquiry_service.extract_merchant_identity`
- `services.ai_inquiry_service.extract_source_sku_title_from_response_json`
- `services.ai_inquiry_service.fetch_item_get_integrated_size_info`
- `services.ai_inquiry_service.fetch_item_get_response`
- `services.ai_inquiry_service.fetch_item_get_response_json`
- `services.ai_inquiry_service.fetch_source_match_for_sku`
- `services.ai_inquiry_service.find_header_column`
- `services.ai_inquiry_service.find_or_create_header_column`
- `services.ai_inquiry_service.find_or_create_status_column`
- `services.ai_inquiry_service.find_sku_column`
- `services.ai_inquiry_service.prepare_inquiry_image_attachments`
- `services.ai_inquiry_service.prepare_inquiry_product_messages`
- `services.ai_inquiry_service.refresh_ai_1688_login_cache`
- `services.ai_inquiry_service.run_ai_inquiry_from_excel`
- `services.ai_inquiry_service.safe_save_workbook`
- `services.ai_inquiry_service.send_ai_inquiry_messages`
- `services.ai_inquiry_service.send_ai_inquiry_messages.send_one`
- `services.ai_inquiry_service.write_cached_source_1688_dimensions_to_sheet`

### PyInit 反汇编片段

```asm
0x1800407c0: lea rcx, [rip + 0x1bde9]
0x1800407c7: jmp qword ptr [rip + 0x10c72]
0x1800407ce: int3
0x1800407cf: int3
0x1800407d0: push rsi
0x1800407d2: sub rsp, 0x30
0x1800407d6: mov rsi, rcx
0x1800407d9: call qword ptr [rip + 0x10e81]
0x1800407df: mov rcx, qword ptr [rax + 0x10]
0x1800407e3: call qword ptr [rip + 0x1095f]
0x1800407e9: cmp rax, -1
0x1800407ed: je 0x18004083e
0x1800407ef: mov rdx, qword ptr [rip + 0x1b60a]
0x1800407f6: cmp rdx, -1
0x1800407fa: jne 0x180040822
0x1800407fc: mov qword ptr [rip + 0x1b5fd], rax
0x180040803: mov rax, qword ptr [rip + 0x1e3fe]
0x18004080a: test rax, rax
0x18004080d: je 0x180040846
0x18004080f: mov ecx, dword ptr [rax]
0x180040811: add ecx, 1
0x180040814: je 0x18004091d
0x18004081a: mov dword ptr [rax], ecx
0x18004081c: add rsp, 0x30
0x180040820: pop rsi
0x180040821: ret
0x180040822: cmp rdx, rax
0x180040825: je 0x180040803
0x180040827: mov rcx, qword ptr [rip + 0x10caa]
0x18004082e: lea rdx, [rip + 0x127bb]
0x180040835: mov rcx, qword ptr [rcx]
0x180040838: call qword ptr [rip + 0x109c2]
0x18004083e: xor eax, eax
0x180040840: add rsp, 0x30
0x180040844: pop rsi
0x180040845: ret
0x180040846: mov qword ptr [rsp + 0x40], rbx
0x18004084b: lea rdx, [rip + 0x127fe]
0x180040852: mov qword ptr [rsp + 0x48], rbp
0x180040857: mov rcx, rsi
```

## ai_model_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\ai_model_service.cp312-win_amd64.pyd`
- 大小：148480 bytes
- 入口 RVA：`0x1bdc4`
- 导出：`PyInit_ai_model_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 112640 | 112424 | `0x60000020` |
| `.rdata` | 24064 | 23856 | `0x40000040` |
| `.data` | 5632 | 8528 | `0xc0000040` |
| `.pdata` | 4096 | 3600 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 444 | `0x42000040` |

### Imports

- `python312.dll`：`PyArg_ValidateKeywordArguments`, `PyUnicode_DecodeUTF8`, `PyObject_GenericGetAttr`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`, `PyObject_Hash`, `PyUnicode_Concat`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### API 路径

- `- Default proxy endpoint: https://api.silra.cn/v1`
- `Unified Qwen model service.\n\n- Default proxy endpoint: https://api.silra.cn/v1\n- Official DashScope compatible endpoint is kept via call_official_model.\n- The 1688 pipeline uses Qwen only.`

### 业务关键词字符串

- `- The 1688 pipeline uses Qwen only.`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`

### 可见函数/变量名

- `AVHpyp`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E3E3E3`
- `E3E3E3H`
- `E3E3H9A`
- `E3HEMH`
- `E3Hu8A`
- `E3HuHA`
- `E3LEHUI`
- `E3LeMLuHUH`
- `E3LeMLuHUHh`
- `E3MHEHu`
- `FHHt38`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `Gn7HyM`
- `H0L0Ht`
- `H3EH3H`
- `H3HEPH`
- `H3HEpH`
- `HE0HXH`
- `HEHE0HNX`
- `HEHE3HELu`
- `HEHMLUHt`
- `HEHUE3HE`
- `HEHuLu`
- `HEMLHE`
- `HEh33L0H0Mt`
- `HEhL0H0Ht`
- `HEhLIF`
- `HH9Upu`
- `HHHhH9`
- `HHHxyOHtH28`
- `HHLuhW`
- `HHMHtAH`
- `HHMh3I`
- `HHt5LH`
- `HHt6LL`
- `HHtF93`
- `HHtOLIH`
- `HHt_LH`
- `HHto6H`
- `HIHIPHHt`
- `HIPIPPHt`
- `HL8E3g`
- `HLuIHt`
- `HME3Ht`
- `HMHuHt`
- `HML9uu`
- `HMLeHt`
- `HMLmILmM`
- `HMLuMu`
- `HMPH3t`
- `HO8DHM`
- `HUE3HE`
- `HUE3HEA`
- `HUE3LeLLu`
- `HUL9eu`
- `HULMLe`
- `HuE3HUH`
- `HuHUE3HuA`
- `HuHUI3`
- `HuHUII`
- `HuLE3I`
- `HuLMHE`
- `HuoIHt`
- `IE3HEH`
- `IHHH9B`
- `IIM3H0`
- `IfHLHt`
- `InitializeSListHead`
- `L03HEHEHt`
- `L9dtqHH`
- `LHMHtAH`
- `LHuHUI`
- `LIH83H`
- `LMHLEHUN`
- `LMHLEHUQN`

### Cython 符号

- `services.ai_model_service`
- `services.ai_model_service.QwenModelClient.__init__`
- `services.ai_model_service.QwenModelClient._client`
- `services.ai_model_service.QwenModelClient.call_model`
- `services.ai_model_service.QwenModelClient.call_official_model`
- `services.ai_model_service.QwenModelClient.call_proxy_model`
- `services.ai_model_service.QwenModelClient.ensure_model_name`
- `services.ai_model_service.__defaults__`
- `services.ai_model_service.__pyx_defaults`
- `services.ai_model_service.__pyx_scope_struct_1__is_invalid_extra_body_error`
- `services.ai_model_service.__pyx_scope_struct_2_genexpr`
- `services.ai_model_service.__pyx_scope_struct_3_is_ai_auth_error`
- `services.ai_model_service.__pyx_scope_struct_4_genexpr`
- `services.ai_model_service.__pyx_scope_struct__genexpr`
- `services.ai_model_service._contains_image_in_content`
- `services.ai_model_service._contains_image_in_content.genexpr`
- `services.ai_model_service._extract_status_code`
- `services.ai_model_service._is_invalid_extra_body_error`
- `services.ai_model_service._is_invalid_extra_body_error.genexpr`
- `services.ai_model_service._is_rate_limited_error`
- `services.ai_model_service._is_transient_error`
- `services.ai_model_service._to_dict`
- `services.ai_model_service.call_ai_model`
- `services.ai_model_service.call_official_qwen_model`
- `services.ai_model_service.is_ai_auth_error`
- `services.ai_model_service.is_ai_auth_error.genexpr`
- `services.ai_model_service.messages_contain_image`
- `services.ai_model_service.normalize_text`
- `services.ai_model_service.validate_ai_api_key`

### PyInit 反汇编片段

```asm
0x180010bd0: lea rcx, [rip + 0x12f99]
0x180010bd7: jmp qword ptr [rip + 0xc7ea]
0x180010bde: int3
0x180010bdf: int3
0x180010be0: push rsi
0x180010be2: sub rsp, 0x30
0x180010be6: mov rsi, rcx
0x180010be9: call qword ptr [rip + 0xc9a9]
0x180010bef: mov rcx, qword ptr [rax + 0x10]
0x180010bf3: call qword ptr [rip + 0xc537]
0x180010bf9: cmp rax, -1
0x180010bfd: je 0x180010c4e
0x180010bff: mov rdx, qword ptr [rip + 0x12efa]
0x180010c06: cmp rdx, -1
0x180010c0a: jne 0x180010c32
0x180010c0c: mov qword ptr [rip + 0x12eed], rax
0x180010c13: mov rax, qword ptr [rip + 0x14526]
0x180010c1a: test rax, rax
0x180010c1d: je 0x180010c56
0x180010c1f: mov ecx, dword ptr [rax]
0x180010c21: add ecx, 1
0x180010c24: je 0x180010d2d
0x180010c2a: mov dword ptr [rax], ecx
0x180010c2c: add rsp, 0x30
0x180010c30: pop rsi
0x180010c31: ret
0x180010c32: cmp rdx, rax
0x180010c35: je 0x180010c13
0x180010c37: mov rcx, qword ptr [rip + 0xc822]
0x180010c3e: lea rdx, [rip + 0xd37b]
0x180010c45: mov rcx, qword ptr [rcx]
0x180010c48: call qword ptr [rip + 0xc582]
0x180010c4e: xor eax, eax
0x180010c50: add rsp, 0x30
0x180010c54: pop rsi
0x180010c55: ret
0x180010c56: mov qword ptr [rsp + 0x40], rbx
0x180010c5b: lea rdx, [rip + 0xd3be]
0x180010c62: mov qword ptr [rsp + 0x48], rbp
0x180010c67: mov rcx, rsi
```

## ai_reply_freight_recalc_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\ai_reply_freight_recalc_service.cp312-win_amd64.pyd`
- 大小：167936 bytes
- 入口 RVA：`0x22044`
- 导出：`PyInit_ai_reply_freight_recalc_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 137728 | 137640 | `0x60000020` |
| `.rdata` | 22528 | 22360 | `0x40000040` |
| `.data` | 2560 | 5392 | `0xc0000040` |
| `.pdata` | 3072 | 2784 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 284 | `0x42000040` |

### Imports

- `python312.dll`：`_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`, `PyObject_Hash`, `PyUnicode_Concat`, `PyDict_GetItemWithError`, `PyInterpreterState_GetID`, `PyObject_GetAttr`, `PyModule_GetName`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `Module 'ai_reply_freight_recalc_service' has already been imported. Re-initialisation is not supported.`
- `PyInit_ai_reply_freight_recalc_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `ai_reply_freight_recalc_service.cp312-win_amd64.pyd`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `init services.ai_reply_freight_recalc_service`
- `services/ai_reply_freight_recalc_service.py`
- `services\ai_reply_freight_recalc_service.c`

### 可见函数/变量名

- `AHHLII`
- `CythonUnboundCMethod`
- `DisableThreadLibraryCalls`
- `DpXvv8`
- `E3HEHHEHE`
- `E3HEMHH`
- `E3HuLLmHUIG`
- `E3LMLEHUj`
- `E3LuhA`
- `E3LuxA`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `Gzgmac`
- `H0L0Ht`
- `H3EH3H`
- `H3HEXIs`
- `H3fHLXHt`
- `H98tcH`
- `H98tcHA`
- `HEE3EHH`
- `HEHHHu`
- `HEHHuH`
- `HEHuJtLF`
- `HEHuwLF`
- `HELmyME`
- `HEXLHu`
- `HEwLHu`
- `HHHxyOHtH28`
- `HHMXH3`
- `HHt5LH`
- `HHt5LL`
- `HHt7Hu`
- `HHtOLIH`
- `HHt_LH`
- `HHte3Mt`
- `HHuH9F`
- `HIHIPHHt`
- `HIPIPPHt`
- `HLMLELHU`
- `HLMLELHUm`
- `HM0HHE0`
- `HM8HE8`
- `HMHUE3LuA`
- `HO8DHM`
- `HUE3HEA`
- `HUHEbq`
- `HUHuE3LuA`
- `HULLuI`
- `HULuE3LeA`
- `HuHEHt`
- `IfHLHt`
- `InitializeSListHead`
- `LHHHHHuc`
- `LHtLHUL`
- `LHu6L5`
- `LMHLEHUj`
- `LMILEHU0v`
- `LMILEHUA`
- `LMILEHUD`
- `LMILEHUI`
- `LMILEHUJ`
- `LMILEHUl`
- `LMILEHUn`
- `LMILEHUt`
- `LeHUHHbr`
- `LeHUHI`
- `LeHUHr`
- `LepHUhH`
- `Lm0Lm8L`
- `LmHLmPLmXLm`
- `LmHUHG`
- `LmLmLm`
- `LmoHHt`
- `MHE8E3f`
- `MLMLEHU`
- `QueryPerformanceCounter`
- `RfTQaTtJLddNIsQULD`
- `SUVWAVH`
- `SUWAUH`

### Cython 符号

- `services.ai_reply_freight_recalc_service`
- `services.ai_reply_freight_recalc_service._build_header_index`
- `services.ai_reply_freight_recalc_service._cell_value`
- `services.ai_reply_freight_recalc_service._column_ref`
- `services.ai_reply_freight_recalc_service._extract_misc_fee_rate_from_formula`
- `services.ai_reply_freight_recalc_service._find_suggested_sale_headers`
- `services.ai_reply_freight_recalc_service._first_column`
- `services.ai_reply_freight_recalc_service._format_message`
- `services.ai_reply_freight_recalc_service._format_rate_for_formula`
- `services.ai_reply_freight_recalc_service._log`
- `services.ai_reply_freight_recalc_service._parse_dimension_to_cm`
- `services.ai_reply_freight_recalc_service._parse_profit_rate_from_suggested_sale_header`
- `services.ai_reply_freight_recalc_service._parse_weight_kg`
- `services.ai_reply_freight_recalc_service._resolve_misc_fee_rate`
- `services.ai_reply_freight_recalc_service._target_profit_rate_for_header`
- `services.ai_reply_freight_recalc_service._write_recalc_formulas`
- `services.ai_reply_freight_recalc_service.recalculate_ai_reply_freight_from_excel`

### PyInit 反汇编片段

```asm
0x180019410: lea rcx, [rip + 0x102a9]
0x180019417: jmp qword ptr [rip + 0x9f62]
0x18001941e: int3
0x18001941f: int3
0x180019420: push rsi
0x180019422: sub rsp, 0x30
0x180019426: mov rsi, rcx
0x180019429: call qword ptr [rip + 0xa129]
0x18001942f: mov rcx, qword ptr [rax + 0x10]
0x180019433: call qword ptr [rip + 0x9cc7]
0x180019439: cmp rax, -1
0x18001943d: je 0x18001948e
0x18001943f: mov rdx, qword ptr [rip + 0x101f2]
0x180019446: cmp rdx, -1
0x18001944a: jne 0x180019472
0x18001944c: mov qword ptr [rip + 0x101e5], rax
0x180019453: mov rax, qword ptr [rip + 0x110a6]
0x18001945a: test rax, rax
0x18001945d: je 0x180019496
0x18001945f: mov ecx, dword ptr [rax]
0x180019461: add ecx, 1
0x180019464: je 0x18001956d
0x18001946a: mov dword ptr [rax], ecx
0x18001946c: add rsp, 0x30
0x180019470: pop rsi
0x180019471: ret
0x180019472: cmp rdx, rax
0x180019475: je 0x180019453
0x180019477: mov rcx, qword ptr [rip + 0x9f92]
0x18001947e: lea rdx, [rip + 0xa95b]
0x180019485: mov rcx, qword ptr [rcx]
0x180019488: call qword ptr [rip + 0x9d0a]
0x18001948e: xor eax, eax
0x180019490: add rsp, 0x30
0x180019494: pop rsi
0x180019495: ret
0x180019496: mov qword ptr [rsp + 0x40], rbx
0x18001949b: lea rdx, [rip + 0xa99e]
0x1800194a2: mov qword ptr [rsp + 0x48], rbp
0x1800194a7: mov rcx, rsi
```

## ai_reply_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\ai_reply_service.cp312-win_amd64.pyd`
- 大小：478208 bytes
- 入口 RVA：`0x646b4`
- 导出：`PyInit_ai_reply_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 410112 | 409624 | `0x60000020` |
| `.rdata` | 48640 | 48390 | `0x40000040` |
| `.data` | 9728 | 18704 | `0xc0000040` |
| `.pdata` | 7168 | 6720 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 1024 | 680 | `0x42000040` |

### Imports

- `python312.dll`：`PyArg_ValidateKeywordArguments`, `PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `Module 'ai_reply_service' has already been imported. Re-initialisation is not supported.`
- `PyInit_ai_reply_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `ai_reply_service.cp312-win_amd64.pyd`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `init services.ai_reply_service`
- `services/ai_reply_service.py`
- `services\ai_reply_service.c`

### 可见函数/变量名

- `AHHLII`
- `ATAWHhyp`
- `CythonUnboundCMethod`
- `DDHIH0`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E333E3E3p`
- `E33E3v`
- `E33E3w`
- `E33E3x`
- `E33E3y`
- `E33HFu`
- `E33HMHt`
- `E3E338`
- `E3E33HAl`
- `E3E3E3`
- `E3E3E35`
- `E3E3E3q`
- `E3E3HH`
- `E3E3HL`
- `E3E3Lm3`
- `E3E3LuE39`
- `E3E3Mt`
- `E3EILT`
- `E3HE3a`
- `E3HE3y`
- `E3HEIH`
- `E3HM3P`
- `E3HMHu`
- `E3Hu0A`
- `E3HuE3M9g`
- `E3LHE8Lm0`
- `E3LHELm`
- `E3Le0H`
- `E3LeELe`
- `E3LeMLuHUH`
- `E3LeMLuHUHZ`
- `E3LmHHt`
- `E3LmMLuHUHr`
- `E3LuLLmHUH`
- `E3MHEHu`
- `E3MHELm`
- `E3MHEpLeh`
- `E3MLuIV`
- `EHHhHt`
- `Et_HyZH`
- `FHAHt28`
- `GHEHHEH`
- `GHGpHH`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H3EH3H`
- `H3HE3Is`
- `H3HEHE`
- `H3HEHIs`
- `H3HEpH`
- `H3HLHt`
- `H3HLPHt`
- `H3HLhHt`
- `H3fHLHt`
- `H6tAHHHE`
- `H98tcH`
- `H98tcHA`
- `HB0Lb8H`
- `HBPHzXH`
- `HBpLBxH`
- `HCpIHLp`
- `HE0HXH`
- `HE3E33`
- `HEHE8HN`
- `HEHEHE`
- `HEHEHEH`
- `HEHEHEHELuB`
- `HEHEHEHh`
- `HEHEHK`
- `HEHHEHEH`
- `HEHHEHt`
- `HEHHHu`

### Cython 符号

- `services.ai_reply_service`
- `services.ai_reply_service.__defaults__`
- `services.ai_reply_service.__pyx_defaults`
- `services.ai_reply_service.__pyx_defaults1`
- `services.ai_reply_service.__pyx_scope_struct_1__replace_size_numbers`
- `services.ai_reply_service.__pyx_scope_struct_2_genexpr`
- `services.ai_reply_service.__pyx_scope_struct_3_genexpr`
- `services.ai_reply_service.__pyx_scope_struct_4__is_response_format_unsupported_error`
- `services.ai_reply_service.__pyx_scope_struct_5_genexpr`
- `services.ai_reply_service.__pyx_scope_struct_6_genexpr`
- `services.ai_reply_service.__pyx_scope_struct_7_genexpr`
- `services.ai_reply_service.__pyx_scope_struct_8_genexpr`
- `services.ai_reply_service.__pyx_scope_struct_9_genexpr`
- `services.ai_reply_service.__pyx_scope_struct__genexpr`
- `services.ai_reply_service._adjust_size_from_unitless_source`
- `services.ai_reply_service._build_dimension_batch_prompt`
- `services.ai_reply_service._build_dimension_prompt`
- `services.ai_reply_service._build_model_image_content`
- `services.ai_reply_service._cache_workbook_images_for_repeated_save`
- `services.ai_reply_service._cache_workbook_images_for_repeated_save.lambda6`
- `services.ai_reply_service._call_dimension_json_model`
- `services.ai_reply_service._clean_reply_text`
- `services.ai_reply_service._compose_images`
- `services.ai_reply_service._compose_images.genexpr`
- `services.ai_reply_service._convert_length_value_to_mm`
- `services.ai_reply_service._decimal_to_clean_text`
- `services.ai_reply_service._dimension_numbers_signature`
- `services.ai_reply_service._dimension_product_key`
- `services.ai_reply_service._download_image`
- `services.ai_reply_service._explicit_source_dimension_signatures`
- `services.ai_reply_service._extract_batch_items`
- `services.ai_reply_service._extract_json_object`
- `services.ai_reply_service._extract_model_message_text`
- `services.ai_reply_service._extract_numbers`
- `services.ai_reply_service._extract_visible_ai_reply_payload`
- `services.ai_reply_service._extract_weight_kg_values`
- `services.ai_reply_service._format_size_mm_value`
- `services.ai_reply_service._format_size_number`
- `services.ai_reply_service._get_model_field`
- `services.ai_reply_service._get_model_field.genexpr`
- `services.ai_reply_service._image_anchor_row_col`
- `services.ai_reply_service._image_bytes_to_data_url`
- `services.ai_reply_service._infer_single_axis_size_from_source`
- `services.ai_reply_service._is_response_format_unsupported_error`
- `services.ai_reply_service._is_response_format_unsupported_error.genexpr`
- `services.ai_reply_service._iter_json_object_candidates`
- `services.ai_reply_service._iter_unitless_source_dimensions`
- `services.ai_reply_service._iter_unitless_source_dimensions.genexpr`
- `services.ai_reply_service._log`
- `services.ai_reply_service._normalize_dimension_batch_model_result`
- `services.ai_reply_service._normalize_dimension_model_result`
- `services.ai_reply_service._normalize_model_key_name`
- `services.ai_reply_service._normalize_size_mm`
- `services.ai_reply_service._normalize_weight_kg`
- `services.ai_reply_service._open_ai_reply_chat`
- `services.ai_reply_service._remove_images_at_cell`
- `services.ai_reply_service._remove_images_in_column`
- `services.ai_reply_service._repair_dimension_json_response`
- `services.ai_reply_service._replace_size_numbers`
- `services.ai_reply_service._replace_size_numbers.replace`
- `services.ai_reply_service._safe_decimal`
- `services.ai_reply_service._scroll_ai_reply_messages_to_bottom`
- `services.ai_reply_service._scroll_ai_reply_messages_up`
- `services.ai_reply_service._stringify_model_field`
- `services.ai_reply_service._to_bool`
- `services.ai_reply_service._wait_ai_reply_messages_loaded`
- `services.ai_reply_service._weight_unit_factor`
- `services.ai_reply_service.analyze_ai_reply_dimensions`
- `services.ai_reply_service.analyze_ai_reply_dimensions_for_products`
- `services.ai_reply_service.apply_ai_reply_column_layout`
- `services.ai_reply_service.collect_ai_reply_content`
- `services.ai_reply_service.find_existing_reply_columns`
- `services.ai_reply_service.find_or_create_reply_columns`
- `services.ai_reply_service.find_status_column`
- `services.ai_reply_service.format_integrated_size_info_for_offer`
- `services.ai_reply_service.parse_ai_reply_payload`
- `services.ai_reply_service.run_ai_reply_from_excel`
- `services.ai_reply_service.run_ai_reply_from_excel.genexpr`
- `services.ai_reply_service.safe_save_workbook`
- `services.ai_reply_service.update_onebound_integrated_size_info`

### PyInit 反汇编片段

```asm
0x1800514d0: lea rcx, [rip + 0x221f9]
0x1800514d7: jmp qword ptr [rip + 0x14f8a]
0x1800514de: int3
0x1800514df: int3
0x1800514e0: push rsi
0x1800514e2: sub rsp, 0x30
0x1800514e6: mov rsi, rcx
0x1800514e9: call qword ptr [rip + 0x15199]
0x1800514ef: mov rcx, qword ptr [rax + 0x10]
0x1800514f3: call qword ptr [rip + 0x14c47]
0x1800514f9: cmp rax, -1
0x1800514fd: je 0x18005154e
0x1800514ff: mov rdx, qword ptr [rip + 0x21d1a]
0x180051506: cmp rdx, -1
0x18005150a: jne 0x180051532
0x18005150c: mov qword ptr [rip + 0x21d0d], rax
0x180051513: mov rax, qword ptr [rip + 0x253e6]
0x18005151a: test rax, rax
0x18005151d: je 0x180051556
0x18005151f: mov ecx, dword ptr [rax]
0x180051521: add ecx, 1
0x180051524: je 0x18005162d
0x18005152a: mov dword ptr [rax], ecx
0x18005152c: add rsp, 0x30
0x180051530: pop rsi
0x180051531: ret
0x180051532: cmp rdx, rax
0x180051535: je 0x180051513
0x180051537: mov rcx, qword ptr [rip + 0x14fca]
0x18005153e: lea rdx, [rip + 0x16e9b]
0x180051545: mov rcx, qword ptr [rcx]
0x180051548: call qword ptr [rip + 0x14cb2]
0x18005154e: xor eax, eax
0x180051550: add rsp, 0x30
0x180051554: pop rsi
0x180051555: ret
0x180051556: mov qword ptr [rsp + 0x40], rbx
0x18005155b: lea rdx, [rip + 0x16ede]
0x180051562: mov qword ptr [rsp + 0x48], rbp
0x180051567: mov rcx, rsi
```

## alibaba_1688_login_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\alibaba_1688_login_service.cp312-win_amd64.pyd`
- 大小：227840 bytes
- 入口 RVA：`0x2ea44`
- 导出：`PyInit_alibaba_1688_login_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 189440 | 189352 | `0x60000020` |
| `.rdata` | 28672 | 28578 | `0x40000040` |
| `.data` | 3584 | 7680 | `0xc0000040` |
| `.pdata` | 4096 | 4068 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 396 | `0x42000040` |

### Imports

- `python312.dll`：`PyArg_ValidateKeywordArguments`, `PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyNumber_Remainder`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `1688 登录状态维护服务`
- `Cookie `
- `Cookie 持久化`
- `Module 'alibaba_1688_login_service' has already been imported. Re-initialisation is not supported.`
- `PyInit_alibaba_1688_login_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `alibaba_1688_login_service.cp312-win_amd64.pyd`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `init services.alibaba_1688_login_service`
- `services/alibaba_1688_login_service.py`
- `services\alibaba_1688_login_service.c`

### 可见函数/变量名

- `AHHLII`
- `CUIGY5o`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E333Mt`
- `E33HEI`
- `E33Le3HuA`
- `E3E3HE3`
- `E3E3HH`
- `E3HMEL`
- `E3HMHt9Li`
- `E3HUHIHEHu`
- `E3HuHA`
- `E3HuxA`
- `E3LEHH`
- `E3LMILEHUs`
- `E3LMILEHUt`
- `E3LeHHt`
- `E3Lm8ILeH`
- `E3LuMt`
- `Et_HyZH`
- `FHAHt28`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H1HuHt`
- `H3EH3H`
- `H3HE0Is`
- `H3HEpH`
- `H3HLHt`
- `H3HLPHt`
- `H83HEHEHt`
- `H98tcH`
- `H98tcHA`
- `HCh3E33LH`
- `HCh3E3LH`
- `HChLHuLuH`
- `HE0HXH`
- `HE3HELe`
- `HE8HHh`
- `HEHEHE`
- `HEHELm9`
- `HEHELu`
- `HEHHEH`
- `HEHHEHu4u`
- `HEHHhH1HuHt`
- `HEHHhf`
- `HEHMHHt`
- `HEHUE3HEA`
- `HELHMHHt`
- `HELeHEH5i`
- `HEhLIF`
- `HExLup`
- `HFhE3AH`
- `HFhH0H8Mt`
- `HFhIH0H8Ht`
- `HH9Upu`
- `HHFhIILuMH0L0Ht`
- `HHHhH9`
- `HHHxyOHtH28`
- `HHLuhW`
- `HHM0H3`
- `HHMh3I`
- `HHt5LH`
- `HHt5LL`
- `HHt7Hu`
- `HHtOLIH`
- `HHt_LH`
- `HHte3Mt`
- `HIE3Hx`
- `HIHIPHHt`
- `HIPIPPHt`
- `HLE3A9u`
- `HLMLELHU`
- `HLuHIHt`
- `HM0Htn9`
- `HM3HHEHE`
- `HME3LeHt`

### Cython 符号

- `services.alibaba_1688_login_service`
- `services.alibaba_1688_login_service.__pyx_scope_struct__genexpr`
- `services.alibaba_1688_login_service._build_slider_drag_steps`
- `services.alibaba_1688_login_service._build_slider_drag_steps.genexpr`
- `services.alibaba_1688_login_service._clamp_slider_drag_distance`
- `services.alibaba_1688_login_service._collect_visible_elements`
- `services.alibaba_1688_login_service._cookie_base_url`
- `services.alibaba_1688_login_service._estimate_slider_drag_distance`
- `services.alibaba_1688_login_service._get_slider_element`
- `services.alibaba_1688_login_service._get_slider_track_element`
- `services.alibaba_1688_login_service._normalize_cookie`
- `services.alibaba_1688_login_service.auto_login_1688_dp`
- `services.alibaba_1688_login_service.click_keep_login_if_present`
- `services.alibaba_1688_login_service.click_login_button_if_present`
- `services.alibaba_1688_login_service.detect_access_state`
- `services.alibaba_1688_login_service.get_body_text`
- `services.alibaba_1688_login_service.has_slider_verification`
- `services.alibaba_1688_login_service.human_typing`
- `services.alibaba_1688_login_service.is_login_success`
- `services.alibaba_1688_login_service.normalize_text`
- `services.alibaba_1688_login_service.refresh_1688_login_cache_from_saved_credentials`
- `services.alibaba_1688_login_service.restore_saved_1688_login_state`
- `services.alibaba_1688_login_service.save_1688_login_state`
- `services.alibaba_1688_login_service.solve_slider_if_present`
- `services.alibaba_1688_login_service.switch_to_password_login`
- `services.alibaba_1688_login_service.wait_for_login_success`

### PyInit 反汇编片段

```asm
0x180023b40: lea rcx, [rip + 0x140a9]
0x180023b47: jmp qword ptr [rip + 0xc8fa]
0x180023b4e: int3
0x180023b4f: int3
0x180023b50: push rsi
0x180023b52: sub rsp, 0x30
0x180023b56: mov rsi, rcx
0x180023b59: call qword ptr [rip + 0xcaf9]
0x180023b5f: mov rcx, qword ptr [rax + 0x10]
0x180023b63: call qword ptr [rip + 0xc5df]
0x180023b69: cmp rax, -1
0x180023b6d: je 0x180023bbe
0x180023b6f: mov rdx, qword ptr [rip + 0x13fca]
0x180023b76: cmp rdx, -1
0x180023b7a: jne 0x180023ba2
0x180023b7c: mov qword ptr [rip + 0x13fbd], rax
0x180023b83: mov rax, qword ptr [rip + 0x15266]
0x180023b8a: test rax, rax
0x180023b8d: je 0x180023bc6
0x180023b8f: mov ecx, dword ptr [rax]
0x180023b91: add ecx, 1
0x180023b94: je 0x180023c9d
0x180023b9a: mov dword ptr [rax], ecx
0x180023b9c: add rsp, 0x30
0x180023ba0: pop rsi
0x180023ba1: ret
0x180023ba2: cmp rdx, rax
0x180023ba5: je 0x180023b83
0x180023ba7: mov rcx, qword ptr [rip + 0xc932]
0x180023bae: lea rdx, [rip + 0xd5cb]
0x180023bb5: mov rcx, qword ptr [rcx]
0x180023bb8: call qword ptr [rip + 0xc64a]
0x180023bbe: xor eax, eax
0x180023bc0: add rsp, 0x30
0x180023bc4: pop rsi
0x180023bc5: ret
0x180023bc6: mov qword ptr [rsp + 0x40], rbx
0x180023bcb: lea rdx, [rip + 0xd60e]
0x180023bd2: mov qword ptr [rsp + 0x48], rbp
0x180023bd7: mov rcx, rsi
```

## alibaba_image_cutout_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\alibaba_image_cutout_service.cp312-win_amd64.pyd`
- 大小：79360 bytes
- 入口 RVA：`0xe5f4`
- 导出：`PyInit_alibaba_image_cutout_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 57344 | 57176 | `0x60000020` |
| `.rdata` | 15872 | 15458 | `0x40000040` |
| `.data` | 2048 | 3312 | `0xc0000040` |
| `.pdata` | 2048 | 1776 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 224 | `0x42000040` |

### Imports

- `python312.dll`：`PyExc_UnboundLocalError`, `PyDict_GetItemWithError`, `PyInterpreterState_GetID`, `PyObject_GetAttr`, `PyModule_GetName`, `PyObject_HasAttr`, `PyErr_GetRaisedException`, `_Py_NoneStruct`, `PyTuple_New`, `PyObject_GenericSetDict`, `PyDict_SetItemString`, `PyDict_Size`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `1688 图片处理服务`
- `Module 'alibaba_image_cutout_service' has already been imported. Re-initialisation is not supported.`
- `PyInit_alibaba_image_cutout_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `alibaba_image_cutout_service.cp312-win_amd64.pyd`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `init services.alibaba_image_cutout_service`
- `services/alibaba_image_cutout_service.py`
- `services\alibaba_image_cutout_service.c`

### 可见函数/变量名

- `AHHLII`
- `DisableThreadLibraryCalls`
- `E3HUPI`
- `E3LEH0`
- `E3LHHu`
- `EE3Hcv`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H1HuHt`
- `H3EH3H`
- `H3HLHt`
- `H98tcH`
- `H98tcHA`
- `HBhE3E3H`
- `HEHEHEHEHEHEHEHEHE`
- `HEHHhH`
- `HEHuIK`
- `HFhH0L0Ht`
- `HHHxyOHtH28`
- `HHt5LH`
- `HHt5LL`
- `HHt9HP`
- `HHtAHH`
- `HHtOLIH`
- `HHt_LH`
- `HHto6H`
- `HIHIPHHt`
- `HIPIPPHt`
- `HMHEHt`
- `HMHEIL5Z`
- `HMHMHUH`
- `HMILeHt`
- `HO8DHM`
- `HUE3HuI`
- `HuLuHK`
- `InitializeSListHead`
- `LHuH5_`
- `LHuTA9`
- `Lu0LuLuH`
- `QueryPerformanceCounter`
- `Qz6_Z_C`
- `SUWAUH`
- `SVWAUAVH`
- `SWAUAVH`
- `SWAUAVH8`
- `UVWATAUAVAWH`
- `VWATAVAWH`
- `WHUE3I`
- `__C_specific_handler`
- `__annotations__`
- `__builtins__`
- `__closure__`
- `__code__`
- `__defaults__`
- `__dict__`
- `__doc__`
- `__file__`
- `__globals__`
- `__kwdefaults__`
- `__loader__`
- `__module__`
- `__name__`
- `__package__`
- `__path__`
- `__qualname__`
- `__reduce__`
- `__std_type_info_destroy_list`
- `__vectorcalloffset__`
- `__weaklistoffset__`
- `_cexit`
- `_configure_narrow_argv`
- `_cython_3_2_4`
- `_execute_onexit_table`
- `_initialize_narrow_environment`
- `_initialize_onexit_table`
- `_initterm`
- `_initterm_e`
- `_is_coroutine`
- `_load_alibaba_sdk`

### Cython 符号

- `services.alibaba_image_cutout_service`
- `services.alibaba_image_cutout_service._load_alibaba_sdk`
- `services.alibaba_image_cutout_service.build_image_seg_client`
- `services.alibaba_image_cutout_service.download_image_bytes`
- `services.alibaba_image_cutout_service.segment_commodity_image`

### PyInit 反汇编片段

```asm
0x180008ff0: lea rcx, [rip + 0xa5c9]
0x180008ff7: jmp qword ptr [rip + 0x62ca]
0x180008ffe: int3
0x180008fff: int3
0x180009000: push rsi
0x180009002: sub rsp, 0x30
0x180009006: mov rsi, rcx
0x180009009: call qword ptr [rip + 0x6481]
0x18000900f: mov rcx, qword ptr [rax + 0x10]
0x180009013: call qword ptr [rip + 0x60af]
0x180009019: cmp rax, -1
0x18000901d: je 0x18000906e
0x18000901f: mov rdx, qword ptr [rip + 0xa592]
0x180009026: cmp rdx, -1
0x18000902a: jne 0x180009052
0x18000902c: mov qword ptr [rip + 0xa585], rax
0x180009033: mov rax, qword ptr [rip + 0xaca6]
0x18000903a: test rax, rax
0x18000903d: je 0x180009076
0x18000903f: mov ecx, dword ptr [rax]
0x180009041: add ecx, 1
0x180009044: je 0x18000914d
0x18000904a: mov dword ptr [rax], ecx
0x18000904c: add rsp, 0x30
0x180009050: pop rsi
0x180009051: ret
0x180009052: cmp rdx, rax
0x180009055: je 0x180009033
0x180009057: mov rcx, qword ptr [rip + 0x62f2]
0x18000905e: lea rdx, [rip + 0x674b]
0x180009065: mov rcx, qword ptr [rcx]
0x180009068: call qword ptr [rip + 0x60c2]
0x18000906e: xor eax, eax
0x180009070: add rsp, 0x30
0x180009074: pop rsi
0x180009075: ret
0x180009076: mov qword ptr [rsp + 0x40], rbx
0x18000907b: lea rdx, [rip + 0x678e]
0x180009082: mov qword ptr [rsp + 0x48], rbp
0x180009087: mov rcx, rsi
```

## auto_updater.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\auto_updater.cp312-win_amd64.pyd`
- 大小：165888 bytes
- 入口 RVA：`0x1f754`
- 导出：`PyInit_auto_updater`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 127488 | 127160 | `0x60000020` |
| `.rdata` | 26624 | 26572 | `0x40000040` |
| `.data` | 5632 | 9000 | `0xc0000040` |
| `.pdata` | 4096 | 3768 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 452 | `0x42000040` |

### Imports

- `python312.dll`：`PyArg_ValidateKeywordArguments`, `PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyObject_GenericGetAttr`, `PyTraceBack_Here`, `PyList_SetSlice`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### API 路径

- `services/auto_updater.py`

### 数据库/状态线索

- `        :return: UpdateCheckResult`
- `Module 'auto_updater' has already been imported. Re-initialisation is not supported.`
- `auto_updater.cp312-win_amd64.pyd`
- `init services.auto_updater`
- `services\auto_updater.c`
- `例如 "1.2.3"\n        :return: UpdateCheckResult\n        :raises VersionCheckError: version.json 不可用或版本号不合法`

### 业务关键词字符串

- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`

### 可见函数/变量名

- `AHHLII`
- `AHUMAHE`
- `CtLe8Ct`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E33HMHMLMILEHUE`
- `E3E33H`
- `E3E33HK`
- `E3E33Hw`
- `E3HULI`
- `E3LAAM`
- `E3MkE3MsL`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H3EH3H`
- `H3HE3Is`
- `H3HEIs`
- `H3HEhH`
- `H3HLHt`
- `H98tcH`
- `H98tcHA`
- `HCh3ME3H`
- `HE0HXH`
- `HEHEH8`
- `HEgHUE3HEA`
- `HEh33L0H0Mt`
- `HEhL0H0Ht`
- `HEhLIF`
- `HH9Upu`
- `HHELMHLEHUD`
- `HHHhH9`
- `HHHxyOHtH28`
- `HHLuhW`
- `HHMH3U`
- `HHMh3I`
- `HHhL1LuMt`
- `HHt5LH`
- `HHt6LL`
- `HHt9HP`
- `HHtOLIH`
- `HHt_LH`
- `HHto6H`
- `HHu0L5mV`
- `HIHIPHHt`
- `HIPIPPHt`
- `HK0HC0H`
- `HK8HC8H`
- `HKHHCHH`
- `HLMLELHU`
- `HMHEIH5F`
- `HMHELuHMHEHM9`
- `HMLeHt`
- `HMhH3s`
- `HO8DHM`
- `HUE3HEA`
- `HUE3HEI`
- `HUE3HEMLeH`
- `HUE3HuI`
- `HUE3LeI`
- `HUHEHp`
- `HUHSHHO8`
- `HUIWPHK8`
- `HUMLHU`
- `HUMLmI`
- `HUPLEXI`
- `HXDJLEx`
- `HYh3Is`
- `HcIH43H`
- `HcIH4H`
- `IFhHUH`
- `IHHteH`
- `IHLXHt`
- `IHMH3U`
- `ILUwLUHELE`
- `InitializeSListHead`
- `LEHEIL5Z`
- `LEMLIH`

### Cython 符号

- `services.auto_updater`
- `services.auto_updater.AutoUpdater.__init__`
- `services.auto_updater.AutoUpdater._normalize_installer_args`
- `services.auto_updater.AutoUpdater._normalize_sha256`
- `services.auto_updater.AutoUpdater._normalize_sha256.genexpr`
- `services.auto_updater.AutoUpdater._parse_remote_payload`
- `services.auto_updater.AutoUpdater._parse_total_size`
- `services.auto_updater.AutoUpdater._parse_version`
- `services.auto_updater.AutoUpdater._resolve_temp_dir`
- `services.auto_updater.AutoUpdater._safe_remove`
- `services.auto_updater.AutoUpdater.check_for_update`
- `services.auto_updater.AutoUpdater.check_for_update_async`
- `services.auto_updater.AutoUpdater.check_for_update_async._worker`
- `services.auto_updater.AutoUpdater.download_and_install_async`
- `services.auto_updater.AutoUpdater.download_and_install_async._worker`
- `services.auto_updater.AutoUpdater.download_installer`
- `services.auto_updater.AutoUpdater.download_installer_async`
- `services.auto_updater.AutoUpdater.download_installer_async._worker`
- `services.auto_updater.AutoUpdater.fetch_remote_version_info`
- `services.auto_updater.AutoUpdater.install_and_exit`
- `services.auto_updater.__defaults__`
- `services.auto_updater.__pyx_defaults`
- `services.auto_updater.__pyx_defaults1`
- `services.auto_updater.__pyx_scope_struct_1_download_installer_async`
- `services.auto_updater.__pyx_scope_struct_2_download_and_install_async`
- `services.auto_updater.__pyx_scope_struct_3_genexpr`
- `services.auto_updater.__pyx_scope_struct__check_for_update_async`

### PyInit 反汇编片段

```asm
0x180013b20: lea rcx, [rip + 0x153c9]
0x180013b27: jmp qword ptr [rip + 0xd892]
0x180013b2e: int3
0x180013b2f: int3
0x180013b30: push rsi
0x180013b32: sub rsp, 0x30
0x180013b36: mov rsi, rcx
0x180013b39: call qword ptr [rip + 0xda71]
0x180013b3f: mov rcx, qword ptr [rax + 0x10]
0x180013b43: call qword ptr [rip + 0xd5f7]
0x180013b49: cmp rax, -1
0x180013b4d: je 0x180013b9e
0x180013b4f: mov rdx, qword ptr [rip + 0x1518a]
0x180013b56: cmp rdx, -1
0x180013b5a: jne 0x180013b82
0x180013b5c: mov qword ptr [rip + 0x1517d], rax
0x180013b63: mov rax, qword ptr [rip + 0x167a6]
0x180013b6a: test rax, rax
0x180013b6d: je 0x180013ba6
0x180013b6f: mov ecx, dword ptr [rax]
0x180013b71: add ecx, 1
0x180013b74: je 0x180013c7d
0x180013b7a: mov dword ptr [rax], ecx
0x180013b7c: add rsp, 0x30
0x180013b80: pop rsi
0x180013b81: ret
0x180013b82: cmp rdx, rax
0x180013b85: je 0x180013b63
0x180013b87: mov rcx, qword ptr [rip + 0xd8ca]
0x180013b8e: lea rdx, [rip + 0xe48b]
0x180013b95: mov rcx, qword ptr [rcx]
0x180013b98: call qword ptr [rip + 0xd632]
0x180013b9e: xor eax, eax
0x180013ba0: add rsp, 0x30
0x180013ba4: pop rsi
0x180013ba5: ret
0x180013ba6: mov qword ptr [rsp + 0x40], rbx
0x180013bab: lea rdx, [rip + 0xe4ce]
0x180013bb2: mov qword ptr [rsp + 0x48], rbp
0x180013bb7: mov rcx, rsi
```

## automation_pipeline.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\automation_pipeline.cp312-win_amd64.pyd`
- 大小：666112 bytes
- 入口 RVA：`0x8f904`
- 导出：`PyInit_automation_pipeline`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 586752 | 586440 | `0x60000020` |
| `.rdata` | 59904 | 59720 | `0x40000040` |
| `.data` | 9728 | 20152 | `0xc0000040` |
| `.pdata` | 7168 | 7020 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 1024 | 788 | `0x42000040` |

### Imports

- `python312.dll`：`PyErr_Occurred`, `PyArg_ValidateKeywordArguments`, `PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyTraceBack_Here`, `PyList_SetSlice`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`
- `KERNEL32.dll`：`GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `DisableThreadLibraryCalls`, `InitializeSListHead`, `QueryPerformanceCounter`
- `VCRUNTIME140.dll`：`strrchr`, `__C_specific_handler`, `__std_type_info_destroy_list`, `memset`, `memmove`, `memcpy`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_cexit`, `_execute_onexit_table`, `_initialize_onexit_table`, `_initialize_narrow_environment`, `_configure_narrow_argv`, `_seh_filter_dll`, `_initterm_e`, `_initterm`

### API 路径

- `services/automation_pipeline.py`

### 业务关键词字符串

- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `判断是否仍有商品计算/1688链路上的剩余任务`
- `批量处理种子SKU`
- `负责种子 SKU 扫描`
- `针对一个种子SKU`

### 可见函数/变量名

- `AHHLII`
- `AHLuILu`
- `CICICICLMHLEHU`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DeLuXDe0LmLm`
- `DisableThreadLibraryCalls`
- `E30L5qT`
- `E3333A`
- `E333L5`
- `E33E3E3`
- `E33HEMt`
- `E33Lu3LeHLm`
- `E3E338`
- `E3E33H`
- `E3E33H5d`
- `E3E33HMoH`
- `E3E33HMoLH`
- `E3E3E3B`
- `E3E3Le`
- `E3E3Le3H`
- `E3EAHH`
- `E3HE0H`
- `E3HEE3HE`
- `E3HEHB`
- `E3HLmLmALmE`
- `E3HLuxA`
- `E3HM3LeH`
- `E3HUPA`
- `E3HUPI`
- `E3Ht8HG`
- `E3Hu8A`
- `E3IIE3`
- `E3ILeH`
- `E3LAAM`
- `E3LEgD9`
- `E3LHEHuLm`
- `E3LHLuH`
- `E3LMLE`
- `E3LeHt`
- `E3LeLLmHUHW`
- `E3LmLmLmLeA`
- `E3LuHt`
- `E3LuxLIIi`
- `E3MHELm`
- `E3jHuL`
- `ELuA4D`
- `Et_HyZH`
- `Exception`
- `FHAHt28`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H03HEE3Ht`
- `H03HEHEHt`
- `H1HuHt`
- `H3EH3H`
- `H3HEHHB`
- `H3HEIs`
- `H3HLHt`
- `H3HLPHt`
- `H3HLXHt`
- `H98tcH`
- `H98tcHA`
- `HE0HXH`
- `HE0LHu`
- `HE3HELe`
- `HE3HuIHEMt`
- `HE3LMHLEIHU`
- `HE8HMHHAhH`
- `HEE3LuIHEMt`
- `HEH98t`
- `HEHEHE`
- `HEHEHEHEHE`
- `HEHEHt`
- `HEHELm`
- `HEHHEH`
- `HEHHHhf`
- `HEHHHu`
- `HEHHhH`

### Cython 符号

- `services.automation_pipeline`
- `services.automation_pipeline.AutomationPipelineController.__init__`
- `services.automation_pipeline.AutomationPipelineController._append_candidate_store`
- `services.automation_pipeline.AutomationPipelineController._candidate_cache_has_items`
- `services.automation_pipeline.AutomationPipelineController._candidate_cache_size`
- `services.automation_pipeline.AutomationPipelineController._clear_discovery_empty_result_streak`
- `services.automation_pipeline.AutomationPipelineController._count_offer_sellers`
- `services.automation_pipeline.AutomationPipelineController._dispose_driver_with_self_heal`
- `services.automation_pipeline.AutomationPipelineController._drain_pending_product_queue`
- `services.automation_pipeline.AutomationPipelineController._drain_pending_product_queue._drain_queue`
- `services.automation_pipeline.AutomationPipelineController._ensure_discovery_driver`
- `services.automation_pipeline.AutomationPipelineController._ensure_product_driver`
- `services.automation_pipeline.AutomationPipelineController._ensure_product_workers_alive`
- `services.automation_pipeline.AutomationPipelineController._ensure_seed_supply`
- `services.automation_pipeline.AutomationPipelineController._ensure_worker_thread`
- `services.automation_pipeline.AutomationPipelineController._evaluate_candidate_store_cache`
- `services.automation_pipeline.AutomationPipelineController._evaluate_candidate_store_cache._flush_store_insert_batch`
- `services.automation_pipeline.AutomationPipelineController._evaluate_store`
- `services.automation_pipeline.AutomationPipelineController._evaluate_store.genexpr`
- `services.automation_pipeline.AutomationPipelineController._extract_driver_service_pid`
- `services.automation_pipeline.AutomationPipelineController._extract_mysql_error_code`
- `services.automation_pipeline.AutomationPipelineController._extract_rating_from_rating_keys`
- `services.automation_pipeline.AutomationPipelineController._extract_rating_from_star_badge`
- `services.automation_pipeline.AutomationPipelineController._extract_star_sellers`
- `services.automation_pipeline.AutomationPipelineController._fetch_json_page`
- `services.automation_pipeline.AutomationPipelineController._get_active_store_worker_id`
- `services.automation_pipeline.AutomationPipelineController._has_pending_product_work`
- `services.automation_pipeline.AutomationPipelineController._has_star_rating`
- `services.automation_pipeline.AutomationPipelineController._initialize_good_product_limit_state`
- `services.automation_pipeline.AutomationPipelineController._is_browser_error_page`
- `services.automation_pipeline.AutomationPipelineController._is_browser_error_page.genexpr`
- `services.automation_pipeline.AutomationPipelineController._is_ozon_risk_challenge_page`
- `services.automation_pipeline.AutomationPipelineController._is_persistent_ozon_risk_challenge`
- `services.automation_pipeline.AutomationPipelineController._is_transient_mysql_error`
- `services.automation_pipeline.AutomationPipelineController._is_transient_mysql_error.genexpr`
- `services.automation_pipeline.AutomationPipelineController._join_product_workers`
- `services.automation_pipeline.AutomationPipelineController._join_store_workers`
- `services.automation_pipeline.AutomationPipelineController._kill_edge_processes_for_profile`
- `services.automation_pipeline.AutomationPipelineController._kill_edge_processes_for_profile.genexpr`
- `services.automation_pipeline.AutomationPipelineController._kill_process_tree_by_pid`
- `services.automation_pipeline.AutomationPipelineController._lease_heartbeat_loop`
- `services.automation_pipeline.AutomationPipelineController._normalize_user_data_dir`
- `services.automation_pipeline.AutomationPipelineController._parse_rating_value`
- `services.automation_pipeline.AutomationPipelineController._pop_candidate_store`
- `services.automation_pipeline.AutomationPipelineController._prepare_product_worker_profiles`
- `services.automation_pipeline.AutomationPipelineController._process_seed_sku`
- `services.automation_pipeline.AutomationPipelineController._product_worker_loop`
- `services.automation_pipeline.AutomationPipelineController._raise_if_browser_error_page`
- `services.automation_pipeline.AutomationPipelineController._raise_if_ozon_risk_challenge`
- `services.automation_pipeline.AutomationPipelineController._rebuild_discovery_driver`
- `services.automation_pipeline.AutomationPipelineController._record_discovery_browser_error`
- `services.automation_pipeline.AutomationPipelineController._record_discovery_empty_result`
- `services.automation_pipeline.AutomationPipelineController._record_driver_restart_and_get_cooldown`
- `services.automation_pipeline.AutomationPipelineController._recover_discovery_driver_after_risk`
- `services.automation_pipeline.AutomationPipelineController._recover_discovery_driver_with_clean_profile`
- `services.automation_pipeline.AutomationPipelineController._recover_product_driver_with_clean_profile`
- `services.automation_pipeline.AutomationPipelineController._reset_discovery_driver`
- `services.automation_pipeline.AutomationPipelineController._reset_product_driver`
- `services.automation_pipeline.AutomationPipelineController._resolve_machine_fingerprint`
- `services.automation_pipeline.AutomationPipelineController._resolve_store_worker_count`
- `services.automation_pipeline.AutomationPipelineController._run_store_round`
- `services.automation_pipeline.AutomationPipelineController._run_store_round.genexpr`
- `services.automation_pipeline.AutomationPipelineController._set_active_store_worker_id`
- `services.automation_pipeline.AutomationPipelineController._shutdown`
- `services.automation_pipeline.AutomationPipelineController._snapshot_page_for_risk_detection`
- `services.automation_pipeline.AutomationPipelineController._stale_lock_cleanup_loop`
- `services.automation_pipeline.AutomationPipelineController._start_lease_heartbeat`
- `services.automation_pipeline.AutomationPipelineController._start_product_worker`
- `services.automation_pipeline.AutomationPipelineController._start_product_workers`
- `services.automation_pipeline.AutomationPipelineController._start_stale_lock_cleanup`
- `services.automation_pipeline.AutomationPipelineController._start_store_workers`
- `services.automation_pipeline.AutomationPipelineController._stop_lease_heartbeat`
- `services.automation_pipeline.AutomationPipelineController._stop_stale_lock_cleanup`
- `services.automation_pipeline.AutomationPipelineController._store_worker_label`
- `services.automation_pipeline.AutomationPipelineController._store_worker_loop`
- `services.automation_pipeline.AutomationPipelineController._sync_open_store_task_count`
- `services.automation_pipeline.AutomationPipelineController._sync_pending_seed_task_count`
- `services.automation_pipeline.AutomationPipelineController._wait_after_db_failure`
- `services.automation_pipeline.AutomationPipelineController._wait_for_document_render_complete`
- `services.automation_pipeline.AutomationPipelineController._wait_risk_auto_settle_window`

### PyInit 反汇编片段

```asm
0x18007cb20: lea rcx, [rip + 0x24d49]
0x18007cb27: jmp qword ptr [rip + 0x1493a]
0x18007cb2e: int3
0x18007cb2f: int3
0x18007cb30: push rsi
0x18007cb32: sub rsp, 0x30
0x18007cb36: mov rsi, rcx
0x18007cb39: call qword ptr [rip + 0x14ae1]
0x18007cb3f: mov rcx, qword ptr [rax + 0x10]
0x18007cb43: call qword ptr [rip + 0x1460f]
0x18007cb49: cmp rax, -1
0x18007cb4d: je 0x18007cb9e
0x18007cb4f: mov rdx, qword ptr [rip + 0x2442a]
0x18007cb56: cmp rdx, -1
0x18007cb5a: jne 0x18007cb82
0x18007cb5c: mov qword ptr [rip + 0x2441d], rax
0x18007cb63: mov rax, qword ptr [rip + 0x28336]
0x18007cb6a: test rax, rax
0x18007cb6d: je 0x18007cba6
0x18007cb6f: mov ecx, dword ptr [rax]
0x18007cb71: add ecx, 1
0x18007cb74: je 0x18007cc7d
0x18007cb7a: mov dword ptr [rax], ecx
0x18007cb7c: add rsp, 0x30
0x18007cb80: pop rsi
0x18007cb81: ret
0x18007cb82: cmp rdx, rax
0x18007cb85: je 0x18007cb63
0x18007cb87: mov rcx, qword ptr [rip + 0x1497a]
0x18007cb8e: lea rdx, [rip + 0x1780b]
0x18007cb95: mov rcx, qword ptr [rcx]
0x18007cb98: call qword ptr [rip + 0x1466a]
0x18007cb9e: xor eax, eax
0x18007cba0: add rsp, 0x30
0x18007cba4: pop rsi
0x18007cba5: ret
0x18007cba6: mov qword ptr [rsp + 0x40], rbx
0x18007cbab: lea rdx, [rip + 0x1784e]
0x18007cbb2: mov qword ptr [rsp + 0x48], rbp
0x18007cbb7: mov rcx, rsi
```

## browser_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\browser_service.cp312-win_amd64.pyd`
- 大小：830464 bytes
- 入口 RVA：`0xb67e4`
- 导出：`PyInit_browser_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 745984 | 745896 | `0x60000020` |
| `.rdata` | 64512 | 64490 | `0x40000040` |
| `.data` | 9728 | 22784 | `0xc0000040` |
| `.pdata` | 7680 | 7644 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 1024 | 816 | `0x42000040` |

### Imports

- `python312.dll`：`PyArg_ValidateKeywordArguments`, `PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyNumber_Absolute`, `PyTraceBack_Here`, `PyList_SetSlice`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 数据库/状态线索

- ` SOURCE_1688_THREAD_COUNT `
- ` detail_queue`
- `Wait for a queue to drain without corrupting its unfinished-task count.`
- `原先的 SOURCE_1688_THREAD_COUNT 现在不再控制浏览器实例数量`
- `浏览器线程优先处理 detail_queue`

### 业务关键词字符串

- `    1688 `
- `    Keep Maozi ERP login state in the copied profile, then remove Ozon/browser`
- `    source_driver `
- ` 1688 `
- ` Excel `
- `1688 改为单浏览器执行线程`
- `JSON API`
- `Keep Maozi ERP login state in the copied profile, then remove Ozon/browser\n    state that can carry a risk challenge into a rebuilt worker browser.`
- `Ozon 商品处理和 1688 找货源联动`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `xO>|srOocr!`
- `一个 SKU 的 1688 子流程彻底结束后统一收尾`
- `从好店Excel读取店铺`
- `从队列取 SKU`
- `所有 1688 中间阶段都统一走阻塞式有界队列`
- `所有 1688 页面操作统一串行处理`
- `模型匹配 -> 利润守卫 -> 入选 -> 写入缓冲`
- `继续复用同一个\n    source_driver 容易导致后续 SKU 连续失败`
- `能尽快回到 1688 详情页完成闭环`
- `计算利润`
- `访问JSON API`
- `避免同一批 SKU 在内存里无限堆积`
- `避免破坏 Excel 内部任何关于图片和复杂格式的 XML 结构`

### 可见函数/变量名

- `AHAhHH`
- `AHHLII`
- `ALEALG`
- `ALmEIx`
- `CVVUpZ3`
- `CythonUnboundCMethod`
- `DHEHEHE`
- `DHMHHt`
- `DM195Shb`
- `DisableThreadLibraryCalls`
- `E33E33`
- `E33E34`
- `E33E3E3E3`
- `E33E3HM`
- `E33LuE3HuA`
- `E3D9mt`
- `E3E33E3`
- `E3E33E3J`
- `E3E33E3L`
- `E3E33H`
- `E3E33H1`
- `E3E33Hbk`
- `E3E3AEH`
- `E3E3E3`
- `E3E3E3Ht`
- `E3E3E3g`
- `E3E3E3h`
- `E3E3Le0I`
- `E3E3LexI`
- `E3E3Lm3LeH`
- `E3E3Mt`
- `E3ELeLeALe`
- `E3HE8A`
- `E3HEHA`
- `E3HEHEHE`
- `E3HHtM`
- `E3HLMc`
- `E3HMpH`
- `E3HUPI`
- `E3HUXI`
- `E3Hu0A`
- `E3HuLu3HMHE`
- `E3HupHEx`
- `E3HuxHL`
- `E3LAAM`
- `E3LEIHE`
- `E3LHELe`
- `E3LMILEHU`
- `E3LeE3LuLmHG`
- `E3LeHH`
- `E3LeHI`
- `E3LeII`
- `E3LeLeLe`
- `E3LeMt`
- `E3LmHt`
- `E3LuHt`
- `E3LuLuLuLuLu`
- `E3LupH`
- `E3LuxI`
- `E3MHuh`
- `E3MLuHEH`
- `E3XE3E33E3Mt`
- `EHEAHX`
- `ELeELe`
- `ELeLeLe`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H3EH3H`
- `H3HEHB`
- `H3HEHL`
- `H3HEhHB`
- `H3HExHB`
- `H3HLHt`
- `H3HLPHt`
- `H3fHLHt`
- `H5tLHR6HL5HA`
- `H92aHsZ`
- `H98tcH`

### Cython 符号

- `services.browser_service`
- `services.browser_service.__defaults__`
- `services.browser_service.__pyx_defaults`
- `services.browser_service.__pyx_scope_struct_1_genexpr`
- `services.browser_service.__pyx_scope_struct_2_is_ozon_incident_page`
- `services.browser_service.__pyx_scope_struct_3_genexpr`
- `services.browser_service.__pyx_scope_struct_4__search_1688_candidates_with_retries`
- `services.browser_service.__pyx_scope_struct_5_genexpr`
- `services.browser_service.__pyx_scope_struct_6__calculator_worker_loop`
- `services.browser_service.__pyx_scope_struct_7_wait_for_product_elements`
- `services.browser_service.__pyx_scope_struct___is_maozierp_cookie_domain`
- `services.browser_service._append_result_row_and_maybe_flush`
- `services.browser_service._build_edge_options`
- `services.browser_service._build_offer_api_url`
- `services.browser_service._build_product_api_url`
- `services.browser_service._build_result_row_data`
- `services.browser_service._build_source_1688_runtime_profile_dir`
- `services.browser_service._build_source_match_cache_metrics`
- `services.browser_service._build_source_match_cache_metrics._positive_or_none`
- `services.browser_service._build_worker_profile_fallback_dir`
- `services.browser_service._calculate_suggested_sale_price_for_source_match`
- `services.browser_service._calculator_worker_loop`
- `services.browser_service._calculator_worker_loop.close_calculator_driver`
- `services.browser_service._calculator_worker_loop.open_calculator_driver`
- `services.browser_service._calculator_worker_loop.recover_calculator_driver_with_clean_profile`
- `services.browser_service._convert_price_amount_to_cny`
- `services.browser_service._copy_1688_login_profile_for_worker`
- `services.browser_service._copy_ozon_profile_for_worker`
- `services.browser_service._decrement_pending_calc_count`
- `services.browser_service._delete_browser_cookie`
- `services.browser_service._enqueue_1688_source_task`
- `services.browser_service._ensure_good_product_daily_capacity_before_1688`
- `services.browser_service._extract_image_url`
- `services.browser_service._extract_lowest_offer_price_and_sku`
- `services.browser_service._extract_offer_green_price`
- `services.browser_service._extract_offer_sku`
- `services.browser_service._extract_product_prices`
- `services.browser_service._fetch_api_json`
- `services.browser_service._finalize_good_product`
- `services.browser_service._finish_source_1688_pipeline_task`
- `services.browser_service._increment_total_good_products`
- `services.browser_service._is_1688_renderer_timeout_error`
- `services.browser_service._is_maozierp_cookie_domain`
- `services.browser_service._is_maozierp_cookie_domain.genexpr`
- `services.browser_service._is_source_match_cache_fresh`
- `services.browser_service._load_source_match_cache`
- `services.browser_service._maybe_request_stop_due_to_good_product_limit`
- `services.browser_service._normalize_prices`
- `services.browser_service._parse_cache_updated_at`
- `services.browser_service._parse_price_value_with_currency`
- `services.browser_service._prepare_clean_ozon_profile_for_worker`
- `services.browser_service._put_bounded_1688_stage_task`
- `services.browser_service._read_json_from_page`
- `services.browser_service._refresh_source_match_seller_id_if_missing`
- `services.browser_service._remove_runtime_profile_artifacts`
- `services.browser_service._resolve_ozon_product_worker_user_data_dir`
- `services.browser_service._resolve_ozon_store_id_from_plugin_data`
- `services.browser_service._resolve_source_1688_analyzer_thread_count`
- `services.browser_service._resolve_source_1688_detail_browser_thread_count`
- `services.browser_service._resolve_source_1688_detail_local_port`
- `services.browser_service._resolve_source_1688_detail_match_thread_count`
- `services.browser_service._resolve_source_1688_detail_user_data_dir`
- `services.browser_service._resolve_source_1688_thread_count`
- `services.browser_service._resolve_source_1688_user_data_dir`
- `services.browser_service._safe_remove_dir_tree`
- `services.browser_service._safe_update_excel_status`
- `services.browser_service._save_source_match_cache`
- `services.browser_service._search_1688_candidates_with_retries`
- `services.browser_service._search_1688_candidates_with_retries.genexpr`
- `services.browser_service._snapshot_driver_page_text`
- `services.browser_service._source_1688_analyzer_thread_name`
- `services.browser_service._source_1688_analyzer_worker_label`
- `services.browser_service._source_1688_detail_browser_thread_name`
- `services.browser_service._source_1688_detail_browser_worker_label`
- `services.browser_service._source_1688_detail_match_thread_name`
- `services.browser_service._source_1688_detail_match_worker_label`
- `services.browser_service._source_1688_thread_name`
- `services.browser_service._source_1688_worker_label`
- `services.browser_service._source_match_from_cache_row`
- `services.browser_service._source_match_passes_profit_guard`

### PyInit 反汇编片段

```asm
0x1800a1330: lea rcx, [rip + 0x289d9]
0x1800a1337: jmp qword ptr [rip + 0x17132]
0x1800a133e: int3
0x1800a133f: int3
0x1800a1340: push rsi
0x1800a1342: sub rsp, 0x30
0x1800a1346: mov rsi, rcx
0x1800a1349: call qword ptr [rip + 0x17361]
0x1800a134f: mov rcx, qword ptr [rax + 0x10]
0x1800a1353: call qword ptr [rip + 0x16df7]
0x1800a1359: cmp rax, -1
0x1800a135d: je 0x1800a13ae
0x1800a135f: mov rdx, qword ptr [rip + 0x285ba]
0x1800a1366: cmp rdx, -1
0x1800a136a: jne 0x1800a1392
0x1800a136c: mov qword ptr [rip + 0x285ad], rax
0x1800a1373: mov rax, qword ptr [rip + 0x2c576]
0x1800a137a: test rax, rax
0x1800a137d: je 0x1800a13b6
0x1800a137f: mov ecx, dword ptr [rax]
0x1800a1381: add ecx, 1
0x1800a1384: je 0x1800a148d
0x1800a138a: mov dword ptr [rax], ecx
0x1800a138c: add rsp, 0x30
0x1800a1390: pop rsi
0x1800a1391: ret
0x1800a1392: cmp rdx, rax
0x1800a1395: je 0x1800a1373
0x1800a1397: mov rcx, qword ptr [rip + 0x17172]
0x1800a139e: lea rdx, [rip + 0x19eab]
0x1800a13a5: mov rcx, qword ptr [rcx]
0x1800a13a8: call qword ptr [rip + 0x16e62]
0x1800a13ae: xor eax, eax
0x1800a13b0: add rsp, 0x30
0x1800a13b4: pop rsi
0x1800a13b5: ret
0x1800a13b6: mov qword ptr [rsp + 0x40], rbx
0x1800a13bb: lea rdx, [rip + 0x19eee]
0x1800a13c2: mov qword ptr [rsp + 0x48], rbp
0x1800a13c7: mov rcx, rsi
```

## calculator_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\calculator_service.cp312-win_amd64.pyd`
- 大小：78848 bytes
- 入口 RVA：`0xe674`
- 导出：`PyInit_calculator_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 57344 | 57304 | `0x60000020` |
| `.rdata` | 15360 | 15122 | `0x40000040` |
| `.data` | 2048 | 3824 | `0xc0000040` |
| `.pdata` | 2048 | 1836 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 244 | `0x42000040` |

### Imports

- `python312.dll`：`PyObject_GC_UnTrack`, `PyObject_Hash`, `PyUnicode_Concat`, `PyDict_GetItemWithError`, `PyInterpreterState_GetID`, `PyObject_GetAttr`, `PyModule_GetName`, `PyObject_HasAttr`, `_Py_NoneStruct`, `PyTuple_New`, `PySequence_Contains`, `PyObject_GenericSetDict`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `价格与利润计算服务`
- `核心利润计算公式`

### 可见函数/变量名

- `CythonUnboundCMethod`
- `DisableThreadLibraryCalls`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H3EH3H`
- `H3HEHE`
- `H3HLHt`
- `H98tcH`
- `H98tcHA`
- `HHELfG`
- `HHHxyOHtH28`
- `HHt5LH`
- `HHt5LL`
- `HHtOLIH`
- `HHtTLH`
- `HHt_LH`
- `HIHIPHHt`
- `HIPIPPHt`
- `HMLB0A`
- `HO8DHM`
- `Hu8HU0HnN`
- `InitializeSListHead`
- `LHHHHHuc`
- `LHuTA9`
- `LLepE3HEx`
- `LMusH5`
- `LUAVI8H`
- `LUVI8H`
- `LmHUHA`
- `LmHUH_r`
- `LmHuAE`
- `LuHUHJK`
- `LuHUIEt`
- `QueryPerformanceCounter`
- `SATHhHh`
- `SUWAUH`
- `SVWAUAVH`
- `UVWATAUAVAWH`
- `WHUHE3I`
- `__C_specific_handler`
- `__annotations__`
- `__builtins__`
- `__closure__`
- `__code__`
- `__defaults__`
- `__dict__`
- `__doc__`
- `__file__`
- `__globals__`
- `__kwdefaults__`
- `__loader__`
- `__module__`
- `__name__`
- `__package__`
- `__path__`
- `__qualname__`
- `__reduce__`
- `__std_type_info_destroy_list`
- `__vectorcalloffset__`
- `__weaklistoffset__`
- `_cexit`
- `_configure_narrow_argv`
- `_cython_3_2_4`
- `_evaluate_chargeable_weight`
- `_execute_onexit_table`
- `_in_range`
- `_initialize_narrow_environment`
- `_initialize_onexit_table`
- `_initterm`
- `_initterm_e`
- `_is_coroutine`
- `_match_dimension`
- `_resolve_price_tier`
- `_seh_filter_dll`
- `builtins`
- `calculate_details`
- `calculate_shipping_cost`
- `calculator_service`
- `cython_runtime`

### Cython 符号

- `services.calculator_service`
- `services.calculator_service._evaluate_chargeable_weight`
- `services.calculator_service._in_range`
- `services.calculator_service._match_dimension`
- `services.calculator_service._resolve_price_tier`
- `services.calculator_service.calculate_details`
- `services.calculator_service.calculate_shipping_cost`
- `services.calculator_service.normalize_shipping_channel`

### PyInit 反汇编片段

```asm
0x180006db0: lea rcx, [rip + 0xc849]
0x180006db7: jmp qword ptr [rip + 0x8532]
0x180006dbe: int3
0x180006dbf: int3
0x180006dc0: push rsi
0x180006dc2: sub rsp, 0x30
0x180006dc6: mov rsi, rcx
0x180006dc9: call qword ptr [rip + 0x86c1]
0x180006dcf: mov rcx, qword ptr [rax + 0x10]
0x180006dd3: call qword ptr [rip + 0x82ff]
0x180006dd9: cmp rax, -1
0x180006ddd: je 0x180006e2e
0x180006ddf: mov rdx, qword ptr [rip + 0xc7f2]
0x180006de6: cmp rdx, -1
0x180006dea: jne 0x180006e12
0x180006dec: mov qword ptr [rip + 0xc7e5], rax
0x180006df3: mov rax, qword ptr [rip + 0xd0e6]
0x180006dfa: test rax, rax
0x180006dfd: je 0x180006e36
0x180006dff: mov ecx, dword ptr [rax]
0x180006e01: add ecx, 1
0x180006e04: je 0x180006f0d
0x180006e0a: mov dword ptr [rax], ecx
0x180006e0c: add rsp, 0x30
0x180006e10: pop rsi
0x180006e11: ret
0x180006e12: cmp rdx, rax
0x180006e15: je 0x180006df3
0x180006e17: mov rcx, qword ptr [rip + 0x854a]
0x180006e1e: lea rdx, [rip + 0x89bb]
0x180006e25: mov rcx, qword ptr [rcx]
0x180006e28: call qword ptr [rip + 0x8322]
0x180006e2e: xor eax, eax
0x180006e30: add rsp, 0x30
0x180006e34: pop rsi
0x180006e35: ret
0x180006e36: mov qword ptr [rsp + 0x40], rbx
0x180006e3b: lea rdx, [rip + 0x89fe]
0x180006e42: mov qword ptr [rsp + 0x48], rbp
0x180006e47: mov rcx, rsi
```

## drission_1688_browser.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\drission_1688_browser.cp312-win_amd64.pyd`
- 大小：130560 bytes
- 入口 RVA：`0x190d4`
- 导出：`PyInit_drission_1688_browser`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 101376 | 100920 | `0x60000020` |
| `.rdata` | 20992 | 20948 | `0x40000040` |
| `.data` | 3072 | 5512 | `0xc0000040` |
| `.pdata` | 3072 | 2856 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 336 | `0x42000040` |

### Imports

- `python312.dll`：`PyObject_GC_UnTrack`, `PyObject_Hash`, `PyUnicode_Concat`, `PyDict_GetItemWithError`, `PyInterpreterState_GetID`, `PyObject_GetAttr`, `PyModule_GetName`, `PyObject_HasAttr`, `PyErr_GetRaisedException`, `_Py_NoneStruct`, `PyTuple_New`, `PyObject_GenericSetDict`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- ` 1688 `
- `DrissionPage 版 1688 浏览器封装`
- `Module 'drission_1688_browser' has already been imported. Re-initialisation is not supported.`
- `PyInit_drission_1688_browser`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `drission_1688_browser.cp312-win_amd64.pyd`
- `init services.drission_1688_browser`
- `services/drission_1688_browser.py`
- `services\drission_1688_browser.c`
- `清理 1688 缓存目录`
- `直接删除整个 1688 根文件夹`

### 可见函数/变量名

- `AHHLII`
- `DisableThreadLibraryCalls`
- `E3E3Mt`
- `E3HEMH`
- `E3k33E3`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H3EH3H`
- `H3HE73H`
- `H3HEE3H`
- `H3HEHE`
- `H3HLHt`
- `H3HLXHt`
- `H98tcH`
- `H98tcHA`
- `HEHHhH9Ht`
- `HEpHEHO0`
- `HExLLHEII`
- `HHHxyOHtH28`
- `HHM0H3QU`
- `HHMpH3`
- `HHt5LH`
- `HHt6LL`
- `HHt9HP`
- `HHtOLIH`
- `HHt_LH`
- `HHto6H`
- `HHu6H5`
- `HIHIPHHt`
- `HIPIPPHt`
- `HLHu4H5`
- `HMHEIH5`
- `HMLuHt`
- `HO8DHM`
- `HUE3HE`
- `HUE3HEA`
- `HUE3LeI`
- `HULHULH`
- `HULLuI`
- `HXDJLEx`
- `HtHIHPc`
- `Hu3H5E`
- `Hu3H5L`
- `Hu3H5LI`
- `IFhHUH`
- `IFhILIL0H0Mt`
- `IFhLL0H0Ht`
- `IGhHuL8H0Ht`
- `IGhIHuIL8H0Mt`
- `IWxTw6`
- `InitializeSListHead`
- `JcIUbIHP`
- `LE3HUI`
- `LUSATIkH`
- `LUWIkHX`
- `LeHUH6`
- `LewMLm`
- `LuMLeE3`
- `MHEE3LMH`
- `MLmLMILEHU`
- `QSCcZmh`
- `QueryPerformanceCounter`
- `SUWAUH`
- `SVWAUAVH`
- `SWAUAVH`
- `SWAUAVH8`
- `UVWATAUAVAWH`
- `UWAUHhH`
- `VWATAVAWH`
- `WHUE3I`
- `__C_specific_handler`
- `__annotations__`
- `__builtins__`
- `__closure__`
- `__code__`
- `__defaults__`
- `__dict__`
- `__doc__`

### Cython 符号

- `services.drission_1688_browser`
- `services.drission_1688_browser.Drission1688Driver.__init__`
- `services.drission_1688_browser.Drission1688Driver.add_cookie`
- `services.drission_1688_browser.Drission1688Driver.current_url`
- `services.drission_1688_browser.Drission1688Driver.execute_script`
- `services.drission_1688_browser.Drission1688Driver.find_element`
- `services.drission_1688_browser.Drission1688Driver.find_elements`
- `services.drission_1688_browser.Drission1688Driver.get`
- `services.drission_1688_browser.Drission1688Driver.get_cookies`
- `services.drission_1688_browser.Drission1688Driver.page_source`
- `services.drission_1688_browser.Drission1688Driver.quit`
- `services.drission_1688_browser.Drission1688Driver.refresh`
- `services.drission_1688_browser.Drission1688Driver.replace_page`
- `services.drission_1688_browser.Drission1688Driver.set_page_load_timeout`
- `services.drission_1688_browser.Drission1688Driver.title`
- `services.drission_1688_browser.DrissionElementAdapter.__init__`
- `services.drission_1688_browser.DrissionElementAdapter.click`
- `services.drission_1688_browser.DrissionElementAdapter.is_enabled`
- `services.drission_1688_browser.DrissionElementAdapter.raw_element`
- `services.drission_1688_browser.DrissionElementAdapter.send_keys`
- `services.drission_1688_browser.DrissionElementAdapter.text`
- `services.drission_1688_browser._close_extra_tabs`
- `services.drission_1688_browser._locator_to_drission`
- `services.drission_1688_browser._resolve_edge_browser_path`
- `services.drission_1688_browser.build_1688_chromium_options`
- `services.drission_1688_browser.cleanup_legacy_1688_profile_dirs`
- `services.drission_1688_browser.clear_1688_user_data_dir`
- `services.drission_1688_browser.create_1688_driver_session`
- `services.drission_1688_browser.get_1688_login_state_path`
- `services.drission_1688_browser.get_1688_user_data_dir`
- `services.drission_1688_browser.get_project_root`
- `services.drission_1688_browser.rebuild_1688_driver_session`

### PyInit 反汇编片段

```asm
0x180010030: lea rcx, [rip + 0x107e9]
0x180010037: jmp qword ptr [rip + 0xa2a2]
0x18001003e: int3
0x18001003f: int3
0x180010040: push rsi
0x180010042: sub rsp, 0x30
0x180010046: mov rsi, rcx
0x180010049: call qword ptr [rip + 0xa451]
0x18001004f: mov rcx, qword ptr [rax + 0x10]
0x180010053: call qword ptr [rip + 0xa07f]
0x180010059: cmp rax, -1
0x18001005d: je 0x1800100ae
0x18001005f: mov rdx, qword ptr [rip + 0x10692]
0x180010066: cmp rdx, -1
0x18001006a: jne 0x180010092
0x18001006c: mov qword ptr [rip + 0x10685], rax
0x180010073: mov rax, qword ptr [rip + 0x114fe]
0x18001007a: test rax, rax
0x18001007d: je 0x1800100b6
0x18001007f: mov ecx, dword ptr [rax]
0x180010081: add ecx, 1
0x180010084: je 0x18001018d
0x18001008a: mov dword ptr [rax], ecx
0x18001008c: add rsp, 0x30
0x180010090: pop rsi
0x180010091: ret
0x180010092: cmp rdx, rax
0x180010095: je 0x180010073
0x180010097: mov rcx, qword ptr [rip + 0xa2c2]
0x18001009e: lea rdx, [rip + 0xaf9b]
0x1800100a5: mov rcx, qword ptr [rcx]
0x1800100a8: call qword ptr [rip + 0xa09a]
0x1800100ae: xor eax, eax
0x1800100b0: add rsp, 0x30
0x1800100b4: pop rsi
0x1800100b5: ret
0x1800100b6: mov qword ptr [rsp + 0x40], rbx
0x1800100bb: lea rdx, [rip + 0xafde]
0x1800100c2: mov qword ptr [rsp + 0x48], rbp
0x1800100c7: mov rcx, rsi
```

## exchange_rate_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\exchange_rate_service.cp312-win_amd64.pyd`
- 大小：48128 bytes
- 入口 RVA：`0x7c64`
- 导出：`PyInit_exchange_rate_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 30208 | 30152 | `0x60000020` |
| `.rdata` | 12288 | 12176 | `0x40000040` |
| `.data` | 2048 | 2608 | `0xc0000040` |
| `.pdata` | 1536 | 1452 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 220 | `0x42000040` |

### Imports

- `python312.dll`：`PyUnicode_Concat`, `PyDict_GetItemWithError`, `PyInterpreterState_GetID`, `PyObject_GetAttr`, `PyModule_GetName`, `PyObject_HasAttr`, `_Py_NoneStruct`, `PyTuple_New`, `PyObject_GenericSetDict`, `PyDict_SetItemString`, `PyDict_Size`, `PyFloat_FromDouble`
- `KERNEL32.dll`：`QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `DisableThreadLibraryCalls`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcpy`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initterm`, `_execute_onexit_table`, `_cexit`, `_initialize_onexit_table`

### 业务关键词字符串

- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`

### 可见函数/变量名

- `DisableThreadLibraryCalls`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H3EH3H`
- `HHHxyOHtH28`
- `HHt5LH`
- `HHt5LL`
- `HHt9HP`
- `HHtOLIH`
- `HHt_LH`
- `HHto6H`
- `HIHIPHHt`
- `HIPIPPHt`
- `HUMHLI`
- `HttHHH`
- `IEhHHUHMHH`
- `InitializeSListHead`
- `LHHHHHuc`
- `LHtLHH`
- `LHuTA9`
- `QueryPerformanceCounter`
- `SUWAUH`
- `SVWAUAVH`
- `UVWAUAWH`
- `VWATAVAWH`
- `WE3IHA`
- `WHUE3I`
- `WLm3HE`
- `__C_specific_handler`
- `__annotations__`
- `__builtins__`
- `__closure__`
- `__code__`
- `__defaults__`
- `__dict__`
- `__doc__`
- `__file__`
- `__globals__`
- `__kwdefaults__`
- `__loader__`
- `__module__`
- `__name__`
- `__package__`
- `__path__`
- `__qualname__`
- `__reduce__`
- `__std_type_info_destroy_list`
- `__vectorcalloffset__`
- `__weaklistoffset__`
- `_cexit`
- `_configure_narrow_argv`
- `_cython_3_2_4`
- `_execute_onexit_table`
- `_initialize_narrow_environment`
- `_initialize_onexit_table`
- `_initterm`
- `_initterm_e`
- `_is_coroutine`
- `_refresh_exchange_rate_once`
- `_seh_filter_dll`
- `builtins`
- `cython_runtime`
- `decompress`
- `exchange_rate_service`
- `fetch_rub_to_cny_direct`
- `func_closure`
- `func_code`
- `func_defaults`
- `func_dict`
- `func_doc`
- `func_globals`
- `func_name`
- `loader`
- `memcpy`
- `memset`
- `ntelineI`
- `origin`
- `parent`
- `start_exchange_rate_refresh_once`

### Cython 符号

- `services.exchange_rate_service`
- `services.exchange_rate_service._refresh_exchange_rate_once`
- `services.exchange_rate_service.fetch_rub_to_cny_direct`
- `services.exchange_rate_service.start_exchange_rate_refresh_once`

### PyInit 反汇编片段

```asm
0x180003600: lea rcx, [rip + 0x8fd9]
0x180003607: jmp qword ptr [rip + 0x5ca2]
0x18000360e: int3
0x18000360f: int3
0x180003610: push rsi
0x180003612: sub rsp, 0x30
0x180003616: mov rsi, rcx
0x180003619: call qword ptr [rip + 0x5e41]
0x18000361f: mov rcx, qword ptr [rax + 0x10]
0x180003623: call qword ptr [rip + 0x5a97]
0x180003629: cmp rax, -1
0x18000362d: je 0x18000367e
0x18000362f: mov rdx, qword ptr [rip + 0x8fa2]
0x180003636: cmp rdx, -1
0x18000363a: jne 0x180003662
0x18000363c: mov qword ptr [rip + 0x8f95], rax
0x180003643: mov rax, qword ptr [rip + 0x93d6]
0x18000364a: test rax, rax
0x18000364d: je 0x180003686
0x18000364f: mov ecx, dword ptr [rax]
0x180003651: add ecx, 1
0x180003654: je 0x18000375d
0x18000365a: mov dword ptr [rax], ecx
0x18000365c: add rsp, 0x30
0x180003660: pop rsi
0x180003661: ret
0x180003662: cmp rdx, rax
0x180003665: je 0x180003643
0x180003667: mov rcx, qword ptr [rip + 0x5cba]
0x18000366e: lea rdx, [rip + 0x605b]
0x180003675: mov rcx, qword ptr [rcx]
0x180003678: call qword ptr [rip + 0x5aa2]
0x18000367e: xor eax, eax
0x180003680: add rsp, 0x30
0x180003684: pop rsi
0x180003685: ret
0x180003686: mov qword ptr [rsp + 0x40], rbx
0x18000368b: lea rdx, [rip + 0x609e]
0x180003692: mov qword ptr [rsp + 0x48], rbp
0x180003697: mov rcx, rsi
```

## image_vector_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\image_vector_service.cp312-win_amd64.pyd`
- 大小：197120 bytes
- 入口 RVA：`0x274c4`
- 导出：`PyInit_image_vector_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 159744 | 159288 | `0x60000020` |
| `.rdata` | 27136 | 26680 | `0x40000040` |
| `.data` | 4608 | 8424 | `0xc0000040` |
| `.pdata` | 3584 | 3552 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 404 | `0x42000040` |

### Imports

- `python312.dll`：`PyUnicode_DecodeUTF8`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`, `PyObject_Hash`, `PyUnicode_Concat`
- `KERNEL32.dll`：`GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `DisableThreadLibraryCalls`, `InitializeSListHead`, `QueryPerformanceCounter`
- `VCRUNTIME140.dll`：`strrchr`, `__C_specific_handler`, `__std_type_info_destroy_list`, `memset`, `memmove`, `memcpy`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_cexit`, `_execute_onexit_table`, `_initialize_onexit_table`, `_initialize_narrow_environment`, `_configure_narrow_argv`, `_seh_filter_dll`, `_initterm_e`, `_initterm`

### 业务关键词字符串

- `Module 'image_vector_service' has already been imported. Re-initialisation is not supported.`
- `PyInit_image_vector_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `image_vector_service.cp312-win_amd64.pyd`
- `init services.image_vector_service`
- `services/image_vector_service.py`
- `services\image_vector_service.c`

### 可见函数/变量名

- `AHHLII`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DZ4Qqn`
- `DctMuGH5n`
- `DisableThreadLibraryCalls`
- `E33HMHMLMHLEHU`
- `E3E33H`
- `E3E33I`
- `E3E33I0`
- `E3E3E3`
- `E3E3E3H5Ea`
- `E3E3ES`
- `E3HEE3H`
- `E3HEHu`
- `E3HHExHupL`
- `E3HuEEH5d`
- `E3HuHH`
- `E3IHExLep`
- `E3LeEHt`
- `E3MHE8`
- `Et_HyZH`
- `GHGpHH`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H1HuHt`
- `H3EH3H`
- `H3HLHt`
- `HE0HXH`
- `HE3HEHEHE`
- `HEHEHEHEHEHEHEHEHEHEMt`
- `HEHHEH`
- `HEHHhH1HuHt`
- `HEHtHMH`
- `HEHuDHE`
- `HEh33L8H0Mt`
- `HEhL8H0Ht`
- `HEhLIF`
- `HFhE3E3MH`
- `HH9Upu`
- `HHEHHhL9Mt`
- `HHHhH9`
- `HHHxyOHtH28`
- `HHLuhW`
- `HHMh3I`
- `HHt5LH`
- `HHt5LL`
- `HHt9HP`
- `HHtOLIH`
- `HHt_LH`
- `HHte3Mt`
- `HHtj3Mt`
- `HHu3L5T`
- `HHu4HE`
- `HHuVHE`
- `HIHIPHHt`
- `HIPIPPHt`
- `HLMLELHUA`
- `HMHDaHuHu`
- `HMHEHH`
- `HMHEHt`
- `HMHtt9`
- `HMHu8Ht`
- `HMHuHt`
- `HMHuWH`
- `HMLEHt`
- `HMLmHt`
- `HMLuHt`
- `HO8DHM`
- `HUE3HE`
- `HUE3HEA`
- `HUE3HEMHE`
- `HUE3HEMLuH`
- `HUHUHH`
- `HUHuE3LuA`
- `HUHuHu`
- `HULuE3LeA`
- `HUXE3LmPI`

### Cython 符号

- `services.image_vector_service`
- `services.image_vector_service._NullTerminalStream.flush`
- `services.image_vector_service._NullTerminalStream.isatty`
- `services.image_vector_service._NullTerminalStream.read`
- `services.image_vector_service._NullTerminalStream.readline`
- `services.image_vector_service._NullTerminalStream.write`
- `services.image_vector_service.__defaults__`
- `services.image_vector_service.__pyx_defaults`
- `services.image_vector_service.__pyx_scope_struct_1_genexpr`
- `services.image_vector_service.__pyx_scope_struct___is_cuda_runtime_incompatible_error`
- `services.image_vector_service._encode_images`
- `services.image_vector_service._ensure_terminal_streams`
- `services.image_vector_service._ensure_terminal_streams._has_isatty`
- `services.image_vector_service._is_cuda_runtime_incompatible_error`
- `services.image_vector_service._is_cuda_runtime_incompatible_error.genexpr`
- `services.image_vector_service._is_torch_load_safety_error`
- `services.image_vector_service._load_clip_bundle`
- `services.image_vector_service._load_model_runtime_device_preference`
- `services.image_vector_service._normalize_model_runtime_device_value`
- `services.image_vector_service._open_devnull_stream`
- `services.image_vector_service._resolve_local_clip_model_source`
- `services.image_vector_service._resolve_preferred_torch_device`
- `services.image_vector_service.filter_top_k_candidates`
- `services.image_vector_service.get_last_image_vector_backend`
- `services.image_vector_service.load_image_from_source`

### PyInit 反汇编片段

```asm
0x18001c8b0: lea rcx, [rip + 0x13639]
0x18001c8b7: jmp qword ptr [rip + 0xbb3a]
0x18001c8be: int3
0x18001c8bf: int3
0x18001c8c0: push rsi
0x18001c8c2: sub rsp, 0x30
0x18001c8c6: mov rsi, rcx
0x18001c8c9: call qword ptr [rip + 0xbce9]
0x18001c8cf: mov rcx, qword ptr [rax + 0x10]
0x18001c8d3: call qword ptr [rip + 0xb85f]
0x18001c8d9: cmp rax, -1
0x18001c8dd: je 0x18001c92e
0x18001c8df: mov rdx, qword ptr [rip + 0x133da]
0x18001c8e6: cmp rdx, -1
0x18001c8ea: jne 0x18001c912
0x18001c8ec: mov qword ptr [rip + 0x133cd], rax
0x18001c8f3: mov rax, qword ptr [rip + 0x147de]
0x18001c8fa: test rax, rax
0x18001c8fd: je 0x18001c936
0x18001c8ff: mov ecx, dword ptr [rax]
0x18001c901: add ecx, 1
0x18001c904: je 0x18001ca0d
0x18001c90a: mov dword ptr [rax], ecx
0x18001c90c: add rsp, 0x30
0x18001c910: pop rsi
0x18001c911: ret
0x18001c912: cmp rdx, rax
0x18001c915: je 0x18001c8f3
0x18001c917: mov rcx, qword ptr [rip + 0xbb7a]
0x18001c91e: lea rdx, [rip + 0xc6db]
0x18001c925: mov rcx, qword ptr [rcx]
0x18001c928: call qword ptr [rip + 0xb8a2]
0x18001c92e: xor eax, eax
0x18001c930: add rsp, 0x30
0x18001c934: pop rsi
0x18001c935: ret
0x18001c936: mov qword ptr [rsp + 0x40], rbx
0x18001c93b: lea rdx, [rip + 0xc71e]
0x18001c942: mov qword ptr [rsp + 0x48], rbp
0x18001c947: mov rcx, rsi
```

## maozierp_auto_listing_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\maozierp_auto_listing_service.cp312-win_amd64.pyd`
- 大小：592384 bytes
- 入口 RVA：`0x7d7b4`
- 导出：`PyInit_maozierp_auto_listing_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 512512 | 512376 | `0x60000020` |
| `.rdata` | 61952 | 61510 | `0x40000040` |
| `.data` | 8704 | 19096 | `0xc0000040` |
| `.pdata` | 6656 | 6564 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 1024 | 720 | `0x42000040` |

### Imports

- `python312.dll`：`PyArg_ValidateKeywordArguments`, `PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyNumber_Remainder`, `PyList_Sort`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyNumber_Absolute`, `PyTraceBack_Here`, `PyList_SetSlice`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 数据库/状态线索

- `Module 'maozierp_auto_listing_service' has already been imported. Re-initialisation is not supported.`
- `init services.maozierp_auto_listing_service`
- `maozierp_auto_listing_service.cp312-win_amd64.pyd`
- `services/maozierp_auto_listing_service.py`
- `services\maozierp_auto_listing_service.c`

### 业务关键词字符串

- ` Seller `
- `*"*SKu`
- `G!p,Bl+Z9X*"*SKu`
- `PyInit_maozierp_auto_listing_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `stage`
- `一键上架`
- `在当前一键上架浏览器中弹出 Seller 登录页`
- `毛子ERP自动上架服务`
- `自动Excel上架预热流程`

### 可见函数/变量名

- `AHHLII`
- `B_csTG`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DKCW6lBk`
- `DisableThreadLibraryCalls`
- `E33E3A`
- `E33E3E3H`
- `E33E3H`
- `E33HMH`
- `E33HMHL`
- `E33HMHMLMILEHUX`
- `E3AI9E`
- `E3E333`
- `E3E334`
- `E3E335`
- `E3E338`
- `E3E339`
- `E3E33H`
- `E3E33Q`
- `E3E33R`
- `E3E33p`
- `E3E33v`
- `E3E3Le3`
- `E3E3LmE3H`
- `E3EAHH`
- `E3EHUAAP`
- `E3HE8I`
- `E3HEHEhHE`
- `E3HELeLLe`
- `E3HELmHp`
- `E3HExI`
- `E3HMHt6La`
- `E3HMHt7Li`
- `E3HMLuH`
- `E3Hu0A`
- `E3Hu0v`
- `E3HuXHH`
- `E3IEhHUH`
- `E3IHE3`
- `E3IHELeLu`
- `E3ILuH`
- `E3LAAM`
- `E3LEHH`
- `E3LEHUHIHE`
- `E3LEIH`
- `E3LHELm`
- `E3Le3LeE3LeE3H`
- `E3LeI9E`
- `E3LeLA`
- `E3LeLeLeH`
- `E3LeMHuHUH`
- `E3LeMLuHUH`
- `E3LeMt`
- `E3LmHt`
- `E3LmI9F`
- `E3LmLmLm`
- `E3LmMLeHUH`
- `E3LuHt`
- `E3LuLuLuLuLuLu`
- `E3LuMt`
- `E3LuP9`
- `E3LuhA`
- `E3MHELe`
- `E3MHELm`
- `E3MHEXHuP`
- `E3MHEXLuP`
- `EDELE3`
- `EHHEP9`
- `EoHEw8`
- `GEpwaqWaK`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H1HuHt`
- `H3EH3H`
- `H3HEE3H`
- `H3HEHEHE9`
- `H3HEHH`

### Cython 符号

- `services.maozierp_auto_listing_service`
- `services.maozierp_auto_listing_service.ListingStepError.__init__`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession.__init__`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._build_options`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._clear_shop_selection`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._click_submit`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._close_driver`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._close_modal_if_open`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._create_driver`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._driver_path`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._ensure_driver`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._ensure_login`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._ensure_modal_shop_selection`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._ensure_plugin_patch`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._extract_access_token_from_page`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._extract_offer_id`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._fetch_maozierp_metadata`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._fetch_maozierp_metadata._post`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._fill_input_value`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._format_price_text`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._format_weight_text`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._get_hook_logs`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._get_perf_logs`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._install_hook`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._is_non_retriable_listing_reason`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._is_non_retriable_listing_reason.genexpr`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._is_ozon_product_unavailable`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._keep_only_sku_in_modal`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._list_once`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._list_once.genexpr`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._log`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._login_maozierp_by_saved_credentials`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._normalize_int_values`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._open_manual_ozon_seller_login_tab`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._parse_import_request_body`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._parse_perf_logs`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._pick_import_request`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._prepare_form_memory_for_request`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._prepare_runtime_user_data`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._read_plugin_dir`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._read_saved_credentials`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._remove_runtime_locks`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._resolve_shop_ids_from_client_ids`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._select_form_values_from_bridge`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._select_option`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._select_option._selected_contains`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._select_shops`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._select_shops._selected_contains`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._set_price`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._set_weight`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._solve_slider_if_present`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._trigger_one_click`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._validate_import_response`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._validate_import_shop_ids`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._validate_only_sku_import`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._verify_modal_shop_selection`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._wait_document_ready`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._wait_feedback`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._wait_feedback.genexpr`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._wait_modal`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._wait_modal_shop_selection`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession._wait_plugin_ready`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession.close`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession.list_product`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession.prepare_login_and_warmup`
- `services.maozierp_auto_listing_service.MaoziAutoListingSession.reset_runtime_cache_and_driver`
- `services.maozierp_auto_listing_service.__pyx_scope_struct_1__select_option`
- `services.maozierp_auto_listing_service.__pyx_scope_struct_2__select_shops`
- `services.maozierp_auto_listing_service.__pyx_scope_struct_3__wait_feedback`
- `services.maozierp_auto_listing_service.__pyx_scope_struct_4_genexpr`
- `services.maozierp_auto_listing_service.__pyx_scope_struct_5__is_non_retriable_listing_reason`
- `services.maozierp_auto_listing_service.__pyx_scope_struct_6_genexpr`
- `services.maozierp_auto_listing_service.__pyx_scope_struct_7__list_once`
- `services.maozierp_auto_listing_service.__pyx_scope_struct_8_genexpr`
- `services.maozierp_auto_listing_service.__pyx_scope_struct___fetch_maozierp_metadata`
- `services.maozierp_auto_listing_service._get_shared_session`
- `services.maozierp_auto_listing_service._normalize_bearer_token`
- `services.maozierp_auto_listing_service._normalize_client_id`
- `services.maozierp_auto_listing_service._normalize_sku`
- `services.maozierp_auto_listing_service._now_str`

### PyInit 反汇编片段

```asm
0x180069dc0: lea rcx, [rip + 0x267c9]
0x180069dc7: jmp qword ptr [rip + 0x15682]
0x180069dce: int3
0x180069dcf: int3
0x180069dd0: push rsi
0x180069dd2: sub rsp, 0x30
0x180069dd6: mov rsi, rcx
0x180069dd9: call qword ptr [rip + 0x15891]
0x180069ddf: mov rcx, qword ptr [rax + 0x10]
0x180069de3: call qword ptr [rip + 0x15377]
0x180069de9: cmp rax, -1
0x180069ded: je 0x180069e3e
0x180069def: mov rdx, qword ptr [rip + 0x2614a]
0x180069df6: cmp rdx, -1
0x180069dfa: jne 0x180069e22
0x180069dfc: mov qword ptr [rip + 0x2613d], rax
0x180069e03: mov rax, qword ptr [rip + 0x29c6e]
0x180069e0a: test rax, rax
0x180069e0d: je 0x180069e46
0x180069e0f: mov ecx, dword ptr [rax]
0x180069e11: add ecx, 1
0x180069e14: je 0x180069f1d
0x180069e1a: mov dword ptr [rax], ecx
0x180069e1c: add rsp, 0x30
0x180069e20: pop rsi
0x180069e21: ret
0x180069e22: cmp rdx, rax
0x180069e25: je 0x180069e03
0x180069e27: mov rcx, qword ptr [rip + 0x156c2]
0x180069e2e: lea rdx, [rip + 0x181bb]
0x180069e35: mov rcx, qword ptr [rcx]
0x180069e38: call qword ptr [rip + 0x153ca]
0x180069e3e: xor eax, eax
0x180069e40: add rsp, 0x30
0x180069e44: pop rsi
0x180069e45: ret
0x180069e46: mov qword ptr [rsp + 0x40], rbx
0x180069e4b: lea rdx, [rip + 0x181fe]
0x180069e52: mov qword ptr [rsp + 0x48], rbp
0x180069e57: mov rcx, rsi
```

## maozierp_excel_listing_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\maozierp_excel_listing_service.cp312-win_amd64.pyd`
- 大小：282112 bytes
- 入口 RVA：`0x39754`
- 导出：`PyInit_maozierp_excel_listing_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 233984 | 233656 | `0x60000020` |
| `.rdata` | 34304 | 34218 | `0x40000040` |
| `.data` | 6656 | 11792 | `0xc0000040` |
| `.pdata` | 5120 | 4668 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 488 | `0x42000040` |

### Imports

- `python312.dll`：`PyErr_Occurred`, `PyArg_ValidateKeywordArguments`, `PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `- 校验Excel列是否合法\n- 按`
- `Module 'maozierp_excel_listing_service' has already been imported. Re-initialisation is not supported.`
- `PyInit_maozierp_excel_listing_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `init services.maozierp_excel_listing_service`
- `maozierp_excel_listing_service.cp312-win_amd64.pyd`
- `services/maozierp_excel_listing_service.py`
- `services\maozierp_excel_listing_service.c`
- `取较大值上架\n- 跳过`
- `已上架/上架失败`
- `自动Excel一键上架服务`
- `行并回写上架结果`

### 可见函数/变量名

- `AHHLII`
- `CythonUnboundCMethod`
- `D2Ytae`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E33HN_`
- `E33IE3E3`
- `E33LmE3`
- `E3E33d4`
- `E3E3E3`
- `E3E3Ht`
- `E3E3IX`
- `E3ELeLe`
- `E3HAvD`
- `E3HE8G`
- `E3Ht5H`
- `E3HuKH`
- `E3HuMLe`
- `E3ILeIHMHt`
- `E3LEHH`
- `E3LEHLeL9`
- `E3MHEHuLm`
- `EE3Ex3LmLm`
- `Et_HyZH`
- `FHAHt28`
- `GLGpHH`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H3EH3H`
- `H3HExIs`
- `H3HLHt`
- `H3HLPHt`
- `H3HLpHt`
- `H98tcH`
- `H98tcHA`
- `HE0HXH`
- `HE3L5lP`
- `HE8H9P`
- `HEE3HELu`
- `HEE3HH`
- `HEE3IH`
- `HEE3IHX`
- `HEHEHP`
- `HEHEMt`
- `HEHHhH9Ht`
- `HEHHhL1LuMt`
- `HEHHhL9Mt`
- `HEHHhf`
- `HEHLHu`
- `HEHUE3HEA`
- `HELHULIH`
- `HEgHUE3HE`
- `HEgHUE3HEA`
- `HEgLHELHt79`
- `HEh33L0H0Mt`
- `HEhL0H0Ht`
- `HEhLIF`
- `HEoH39`
- `HEoLHt`
- `HEpE3HH`
- `HEwE3Lmg`
- `HEwHMgHE`
- `HGpIHLx`
- `HH9Upu`
- `HHE3A9u`
- `HHHhH9`
- `HHHxyOHtH28`
- `HHIppH`
- `HHLuhW`
- `HHMh3I`
- `HHt5LH`
- `HHt6LL`
- `HHt9HP`
- `HHtFHP`
- `HHtKHP`
- `HHtOLIH`
- `HHtWIO`
- `HHt_LH`

### Cython 符号

- `services.maozierp_excel_listing_service`
- `services.maozierp_excel_listing_service.__defaults__`
- `services.maozierp_excel_listing_service.__pyx_defaults`
- `services.maozierp_excel_listing_service.__pyx_scope_struct_1_genexpr`
- `services.maozierp_excel_listing_service.__pyx_scope_struct_2_genexpr`
- `services.maozierp_excel_listing_service.__pyx_scope_struct_3_genexpr`
- `services.maozierp_excel_listing_service.__pyx_scope_struct_4__build_listing_record_payload`
- `services.maozierp_excel_listing_service.__pyx_scope_struct_5_run_auto_listing_from_excel`
- `services.maozierp_excel_listing_service.__pyx_scope_struct___is_retryable_variant_filter_failure`
- `services.maozierp_excel_listing_service._build_header_index`
- `services.maozierp_excel_listing_service._build_listing_record_payload`
- `services.maozierp_excel_listing_service._build_listing_record_payload.read_data`
- `services.maozierp_excel_listing_service._clear_auto_listing_result_cells`
- `services.maozierp_excel_listing_service._consume_cached_auto_listing_rows`
- `services.maozierp_excel_listing_service._ensure_column`
- `services.maozierp_excel_listing_service._extract_offer_ids_from_listing_result`
- `services.maozierp_excel_listing_service._extract_sku_from_url`
- `services.maozierp_excel_listing_service._extract_source_sku_from_1688_url`
- `services.maozierp_excel_listing_service._find_suggested_sale_header`
- `services.maozierp_excel_listing_service._get_cached_auto_listing_rows`
- `services.maozierp_excel_listing_service._is_finished_auto_listing_status`
- `services.maozierp_excel_listing_service._is_retryable_variant_filter_failure`
- `services.maozierp_excel_listing_service._is_retryable_variant_filter_failure.genexpr`
- `services.maozierp_excel_listing_service._log`
- `services.maozierp_excel_listing_service._normalize_text`
- `services.maozierp_excel_listing_service._resolve_excel_cache_key`
- `services.maozierp_excel_listing_service._resolve_listing_weight`
- `services.maozierp_excel_listing_service._resolve_profit_rate_rule_code`
- `services.maozierp_excel_listing_service._safe_int`
- `services.maozierp_excel_listing_service._save_listing_records_safely`
- `services.maozierp_excel_listing_service._set_cached_auto_listing_rows`
- `services.maozierp_excel_listing_service._split_shop_names_lines`
- `services.maozierp_excel_listing_service._split_shop_names_lines.genexpr`
- `services.maozierp_excel_listing_service.clear_auto_listing_excel_row_cache`
- `services.maozierp_excel_listing_service.normalize_auto_listing_excel_weight_source`
- `services.maozierp_excel_listing_service.run_auto_listing_from_excel`
- `services.maozierp_excel_listing_service.run_auto_listing_from_excel._should_stop`
- `services.maozierp_excel_listing_service.validate_excel_for_auto_listing`

### PyInit 反汇编片段

```asm
0x18002b850: lea rcx, [rip + 0x199f9]
0x18002b857: jmp qword ptr [rip + 0xfbea]
0x18002b85e: int3
0x18002b85f: int3
0x18002b860: push rsi
0x18002b862: sub rsp, 0x30
0x18002b866: mov rsi, rcx
0x18002b869: call qword ptr [rip + 0xfe09]
0x18002b86f: mov rcx, qword ptr [rax + 0x10]
0x18002b873: call qword ptr [rip + 0xf8cf]
0x18002b879: cmp rax, -1
0x18002b87d: je 0x18002b8ce
0x18002b87f: mov rdx, qword ptr [rip + 0x1965a]
0x18002b886: cmp rdx, -1
0x18002b88a: jne 0x18002b8b2
0x18002b88c: mov qword ptr [rip + 0x1964d], rax
0x18002b893: mov rax, qword ptr [rip + 0x1b55e]
0x18002b89a: test rax, rax
0x18002b89d: je 0x18002b8d6
0x18002b89f: mov ecx, dword ptr [rax]
0x18002b8a1: add ecx, 1
0x18002b8a4: je 0x18002b9ad
0x18002b8aa: mov dword ptr [rax], ecx
0x18002b8ac: add rsp, 0x30
0x18002b8b0: pop rsi
0x18002b8b1: ret
0x18002b8b2: cmp rdx, rax
0x18002b8b5: je 0x18002b893
0x18002b8b7: mov rcx, qword ptr [rip + 0xfc2a]
0x18002b8be: lea rdx, [rip + 0x1106b]
0x18002b8c5: mov rcx, qword ptr [rcx]
0x18002b8c8: call qword ptr [rip + 0xf932]
0x18002b8ce: xor eax, eax
0x18002b8d0: add rsp, 0x30
0x18002b8d4: pop rsi
0x18002b8d5: ret
0x18002b8d6: mov qword ptr [rsp + 0x40], rbx
0x18002b8db: lea rdx, [rip + 0x110ae]
0x18002b8e2: mov qword ptr [rsp + 0x48], rbp
0x18002b8e7: mov rcx, rsi
```

## maozierp_login_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\maozierp_login_service.cp312-win_amd64.pyd`
- 大小：448000 bytes
- 入口 RVA：`0x5d114`
- 导出：`PyInit_maozierp_login_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 379904 | 379512 | `0x60000020` |
| `.rdata` | 47616 | 47594 | `0x40000040` |
| `.data` | 11264 | 19520 | `0xc0000040` |
| `.pdata` | 6656 | 6276 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 1024 | 704 | `0x42000040` |

### Imports

- `python312.dll`：`PyList_Sort`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`, `PyObject_Hash`, `PyUnicode_Concat`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `        Unified store-page login check.`
- ` Seller `
- ` https://seller.ozon.ru/app/products`
- `- 打开 https://seller.ozon.ru/app/products`
- `Module 'maozierp_login_service' has already been imported. Re-initialisation is not supported.`
- `PyInit_maozierp_login_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `Unified store-page login check.\n        Single-click mode: click "???" at most once per page lifecycle.`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `init services.maozierp_login_service`
- `maozierp_login_service.cp312-win_amd64.pyd`
- `services/maozierp_login_service.py`
- `services\maozierp_login_service.c`
- `使用当前 Ozon 主缓存打开 Seller 页面`

### 可见函数/变量名

- `AHHLII`
- `BnoF2H`
- `CtRPLwF`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E33E3A`
- `E33E3E3Q`
- `E33E3E3y`
- `E33HMHMLMHLEHU`
- `E33HMLMHLEHU`
- `E3E33A`
- `E3E33I`
- `E3EAHH`
- `E3HEpA`
- `E3HMLmHU`
- `E3HU8I`
- `E3HUHIHE`
- `E3HUHIHEHu`
- `E3HUHIHELu`
- `E3HuDHuHDHu8DHuP`
- `E3HuHLm`
- `E3HuPI`
- `E3HuxIH`
- `E3IHE3`
- `E3IHELmLu`
- `E3IHEpHuhLux`
- `E3LE8IH`
- `E3LE8IHp`
- `E3LEHH`
- `E3LEHHX`
- `E3LEHHp`
- `E3LEIHE`
- `E3LELIHEHu`
- `E3LMHLEHU`
- `E3LeMHuHUH9`
- `E3LeMHuHUHy`
- `E3LuMt`
- `E3MHEHu`
- `E3MLuHu`
- `EHUHuLM`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H03HEE3HMHEHt`
- `H0L0Ht`
- `H1HuHt`
- `H3EH3H`
- `H3HE3H`
- `H3HEHE`
- `H3HEHH`
- `H3HEIs`
- `H3HLHt`
- `H3ICIKH`
- `H98tcH`
- `H98tcHA`
- `HChE33H`
- `HE0HXH`
- `HE3HM3HEM`
- `HE3LuHt`
- `HE3MuKH5`
- `HE8L3H`
- `HE8LMH`
- `HEE3HM`
- `HEHEHX`
- `HEHEHh`
- `HEHHhH`
- `HEHHhH1Ht`
- `HEHHhH9Ht`
- `HEHHhL1Mt`
- `HEHHhf`
- `HEHUE3HEA`
- `HEHUXH`
- `HELE3H`
- `HEh33L0H0Mt`
- `HEhL0H0Ht`
- `HEhLIF`
- `HFhHHUMH`
- `HGh3MH`
- `HGhH8L8Ht`

### Cython 符号

- `services.maozierp_login_service`
- `services.maozierp_login_service.MaoziErpLoginService.__init__`
- `services.maozierp_login_service.MaoziErpLoginService._close_current_tab_and_back_to_store`
- `services.maozierp_login_service.MaoziErpLoginService._find_login_button_by_text_playwright`
- `services.maozierp_login_service.MaoziErpLoginService._find_login_button_element_selenium`
- `services.maozierp_login_service.MaoziErpLoginService._is_cf_challenge_playwright`
- `services.maozierp_login_service.MaoziErpLoginService._is_cf_challenge_playwright.genexpr`
- `services.maozierp_login_service.MaoziErpLoginService._is_cf_challenge_selenium`
- `services.maozierp_login_service.MaoziErpLoginService._is_cf_challenge_selenium.genexpr`
- `services.maozierp_login_service.MaoziErpLoginService._is_cf_failed_playwright`
- `services.maozierp_login_service.MaoziErpLoginService._is_cf_failed_playwright.genexpr`
- `services.maozierp_login_service.MaoziErpLoginService._is_cf_failed_selenium`
- `services.maozierp_login_service.MaoziErpLoginService._is_cf_failed_selenium.genexpr`
- `services.maozierp_login_service.MaoziErpLoginService._is_login_success_playwright`
- `services.maozierp_login_service.MaoziErpLoginService._is_login_success_selenium`
- `services.maozierp_login_service.MaoziErpLoginService._is_login_success_selenium.genexpr`
- `services.maozierp_login_service.MaoziErpLoginService._is_maozierp_login_form_present_selenium`
- `services.maozierp_login_service.MaoziErpLoginService._log`
- `services.maozierp_login_service.MaoziErpLoginService._login_maozierp_popup_with_saved_credentials_selenium`
- `services.maozierp_login_service.MaoziErpLoginService._login_maozierp_popup_with_saved_credentials_selenium._finish_success`
- `services.maozierp_login_service.MaoziErpLoginService._open_maozierp_login_tab_directly`
- `services.maozierp_login_service.MaoziErpLoginService._passive_wait_for_cf_settlement_playwright`
- `services.maozierp_login_service.MaoziErpLoginService._passive_wait_for_cf_settlement_playwright.genexpr`
- `services.maozierp_login_service.MaoziErpLoginService._passive_wait_for_cf_settlement_selenium`
- `services.maozierp_login_service.MaoziErpLoginService._passive_wait_for_cf_settlement_selenium.genexpr`
- `services.maozierp_login_service.MaoziErpLoginService._safe_close_playwright_page`
- `services.maozierp_login_service.MaoziErpLoginService._slow_random_mouse_slide_playwright`
- `services.maozierp_login_service.MaoziErpLoginService._slow_random_mouse_slide_selenium`
- `services.maozierp_login_service.MaoziErpLoginService._sync_current_token_to_plugin_storage`
- `services.maozierp_login_service.MaoziErpLoginService._wait_new_popup_handle`
- `services.maozierp_login_service.MaoziErpLoginService._wait_state_after_login_click_playwright`
- `services.maozierp_login_service.MaoziErpLoginService._wait_state_after_login_click_selenium`
- `services.maozierp_login_service.MaoziErpLoginService.click_login_prompt_button_humanly`
- `services.maozierp_login_service.MaoziErpLoginService.ensure_store_login`
- `services.maozierp_login_service.MaoziErpLoginService.ensure_store_login._mark_login_click`
- `services.maozierp_login_service.MaoziErpLoginService.ensure_store_login._recent_login_click`
- `services.maozierp_login_service.MaoziErpLoginService.ensure_store_login._wait_prompt_clear`
- `services.maozierp_login_service.MaoziErpLoginService.has_login_prompt_button`
- `services.maozierp_login_service.MaoziErpLoginService.human_like_click`
- `services.maozierp_login_service.MaoziErpLoginService.safe_login_flow`
- `services.maozierp_login_service.__defaults__`
- `services.maozierp_login_service.__pyx_defaults`
- `services.maozierp_login_service.__pyx_scope_struct_10__is_login_success_selenium`
- `services.maozierp_login_service.__pyx_scope_struct_11_genexpr`
- `services.maozierp_login_service.__pyx_scope_struct_12__login_maozierp_popup_with_saved_credentials_selenium`
- `services.maozierp_login_service.__pyx_scope_struct_13__passive_wait_for_cf_settlement_selenium`
- `services.maozierp_login_service.__pyx_scope_struct_14_genexpr`
- `services.maozierp_login_service.__pyx_scope_struct_15_ensure_store_login`
- `services.maozierp_login_service.__pyx_scope_struct_1_genexpr`
- `services.maozierp_login_service.__pyx_scope_struct_2__is_cf_failed_playwright`
- `services.maozierp_login_service.__pyx_scope_struct_3_genexpr`
- `services.maozierp_login_service.__pyx_scope_struct_4__passive_wait_for_cf_settlement_playwright`
- `services.maozierp_login_service.__pyx_scope_struct_5_genexpr`
- `services.maozierp_login_service.__pyx_scope_struct_6__is_cf_challenge_selenium`
- `services.maozierp_login_service.__pyx_scope_struct_7_genexpr`
- `services.maozierp_login_service.__pyx_scope_struct_8__is_cf_failed_selenium`
- `services.maozierp_login_service.__pyx_scope_struct_9_genexpr`
- `services.maozierp_login_service.__pyx_scope_struct___is_cf_challenge_playwright`
- `services.maozierp_login_service._build_edge_options`
- `services.maozierp_login_service._create_edge_driver`
- `services.maozierp_login_service._extract_token`
- `services.maozierp_login_service._inject_token_sniffer`
- `services.maozierp_login_service._is_ozon_seller_app_load_state_ready`
- `services.maozierp_login_service._is_ozon_seller_logged_in_url`
- `services.maozierp_login_service._normalize_plugin_token`
- `services.maozierp_login_service._normalize_token`
- `services.maozierp_login_service._number_from_state`
- `services.maozierp_login_service._read_ozon_seller_app_load_state`
- `services.maozierp_login_service._safe_fill_input`
- `services.maozierp_login_service._solve_slider_if_present`
- `services.maozierp_login_service._sync_token_to_plugin_storage`
- `services.maozierp_login_service.auto_login_maozierp`
- `services.maozierp_login_service.clear_user_data_dir`
- `services.maozierp_login_service.click_login_prompt_button`
- `services.maozierp_login_service.ensure_maozierp_login_for_store`
- `services.maozierp_login_service.fetch_maozierp_token_with_profile`
- `services.maozierp_login_service.get_base_path`
- `services.maozierp_login_service.get_user_data_dir`
- `services.maozierp_login_service.has_login_prompt_button`
- `services.maozierp_login_service.open_ozon_seller_manual_login_window`

### PyInit 反汇编片段

```asm
0x18004d7d0: lea rcx, [rip + 0x1e2f9]
0x18004d7d7: jmp qword ptr [rip + 0x10c12]
0x18004d7de: int3
0x18004d7df: int3
0x18004d7e0: push rsi
0x18004d7e2: sub rsp, 0x30
0x18004d7e6: mov rsi, rcx
0x18004d7e9: call qword ptr [rip + 0x10e11]
0x18004d7ef: mov rcx, qword ptr [rax + 0x10]
0x18004d7f3: call qword ptr [rip + 0x10937]
0x18004d7f9: cmp rax, -1
0x18004d7fd: je 0x18004d84e
0x18004d7ff: mov rdx, qword ptr [rip + 0x1df7a]
0x18004d806: cmp rdx, -1
0x18004d80a: jne 0x18004d832
0x18004d80c: mov qword ptr [rip + 0x1df6d], rax
0x18004d813: mov rax, qword ptr [rip + 0x21416]
0x18004d81a: test rax, rax
0x18004d81d: je 0x18004d856
0x18004d81f: mov ecx, dword ptr [rax]
0x18004d821: add ecx, 1
0x18004d824: je 0x18004d92d
0x18004d82a: mov dword ptr [rax], ecx
0x18004d82c: add rsp, 0x30
0x18004d830: pop rsi
0x18004d831: ret
0x18004d832: cmp rdx, rax
0x18004d835: je 0x18004d813
0x18004d837: mov rcx, qword ptr [rip + 0x10c4a]
0x18004d83e: lea rdx, [rip + 0x12feb]
0x18004d845: mov rcx, qword ptr [rcx]
0x18004d848: call qword ptr [rip + 0x1097a]
0x18004d84e: xor eax, eax
0x18004d850: add rsp, 0x30
0x18004d854: pop rsi
0x18004d855: ret
0x18004d856: mov qword ptr [rsp + 0x40], rbx
0x18004d85b: lea rdx, [rip + 0x1302e]
0x18004d862: mov qword ptr [rsp + 0x48], rbp
0x18004d867: mov rcx, rsi
```

## maozierp_parallel_auto_listing_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\maozierp_parallel_auto_listing_service.cp312-win_amd64.pyd`
- 大小：308224 bytes
- 入口 RVA：`0x3ffd4`
- 导出：`PyInit_maozierp_parallel_auto_listing_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 260608 | 260408 | `0x60000020` |
| `.rdata` | 34816 | 34684 | `0x40000040` |
| `.data` | 5632 | 10888 | `0xc0000040` |
| `.pdata` | 5120 | 4704 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 484 | `0x42000040` |

### Imports

- `python312.dll`：`PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`, `PyObject_Hash`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 数据库/状态线索

- `Module 'maozierp_parallel_auto_listing_service' has already been imported. Re-initialisation is not supported.`
- `init services.maozierp_parallel_auto_listing_service`
- `maozierp_parallel_auto_listing_service.cp312-win_amd64.pyd`
- `services/maozierp_parallel_auto_listing_service.py`
- `services\maozierp_parallel_auto_listing_service.c`

### 业务关键词字符串

- `PyInit_maozierp_parallel_auto_listing_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`

### 可见函数/变量名

- `AHHLII`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E33LmE3`
- `E3E33A`
- `E3E33H`
- `E3E3HN`
- `E3HE8A`
- `E3HEHIHP`
- `E3HEHu`
- `E3HEPA`
- `E3HEpE3H`
- `E3HEpHh`
- `E3HMo3A`
- `E3HMxEHM`
- `E3ILeIHMHt`
- `E3LEHLeL9`
- `E3LEIHh`
- `E3LHEHu`
- `E3LMILEHUT`
- `E3LuHHt`
- `E3ME3L`
- `E3MHEHuLm`
- `EgHEo8`
- `FHAHt28`
- `GHGpHH`
- `GLGpHH`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H3EH3H`
- `H3HE8Is`
- `H3HLPHt`
- `H3HLXHt`
- `H3fHLXHt`
- `H98tcH`
- `H98tcHA`
- `HAtKHM`
- `HE0HXH`
- `HEE3Hh`
- `HEHEHE`
- `HEHEHE8HE8HEHEHEHEHEHEHEHEHt`
- `HEHEHEHEHEHEHEHEHEHEHE`
- `HEHEMt`
- `HEHHEPHX`
- `HEHHhL9Mt`
- `HEHHhf`
- `HEHUE3HEA`
- `HEHuLu`
- `HEgLHu`
- `HEh33L8H0Mt`
- `HEhL8H0Ht`
- `HEhLIF`
- `HEoHEg8`
- `HEoLHu`
- `HEpHEHEH`
- `HEpHEpH`
- `HExHExH`
- `HFpHHLx`
- `HH9Upu`
- `HHELMLE`
- `HHExLMLLEHU`
- `HHHhH9`
- `HHHxyOHtH28`
- `HHLuhW`
- `HHM8H3`
- `HHM8H3D`
- `HHMH3m`
- `HHMh3I`
- `HHt5LH`
- `HHt6LL`
- `HHt9HP`
- `HHtGHHV`
- `HHtOLIH`
- `HHt_LH`
- `HHto6H`
- `HHu1L5`
- `HHu4H5`

### Cython 符号

- `services.maozierp_parallel_auto_listing_service`
- `services.maozierp_parallel_auto_listing_service.AutoListingProgressStore.__init__`
- `services.maozierp_parallel_auto_listing_service.AutoListingProgressStore._connect`
- `services.maozierp_parallel_auto_listing_service.AutoListingProgressStore._init_schema`
- `services.maozierp_parallel_auto_listing_service.AutoListingProgressStore.cleanup_old_runs`
- `services.maozierp_parallel_auto_listing_service.AutoListingProgressStore.create_run`
- `services.maozierp_parallel_auto_listing_service.AutoListingProgressStore.finish_run`
- `services.maozierp_parallel_auto_listing_service.AutoListingProgressStore.insert_jobs`
- `services.maozierp_parallel_auto_listing_service.AutoListingProgressStore.mark_done`
- `services.maozierp_parallel_auto_listing_service.AutoListingProgressStore.mark_processing`
- `services.maozierp_parallel_auto_listing_service.AutoListingProgressStore.recover_interrupted_runs`
- `services.maozierp_parallel_auto_listing_service.ExcelResultWriter.__init__`
- `services.maozierp_parallel_auto_listing_service.ExcelResultWriter._lock_for`
- `services.maozierp_parallel_auto_listing_service.ExcelResultWriter.write_result`
- `services.maozierp_parallel_auto_listing_service.__defaults__`
- `services.maozierp_parallel_auto_listing_service.__pyx_defaults`
- `services.maozierp_parallel_auto_listing_service.__pyx_defaults1`
- `services.maozierp_parallel_auto_listing_service.__pyx_scope_struct_1_genexpr`
- `services.maozierp_parallel_auto_listing_service.__pyx_scope_struct_2_run_parallel_auto_listing`
- `services.maozierp_parallel_auto_listing_service.__pyx_scope_struct___is_finished_auto_listing_status`
- `services.maozierp_parallel_auto_listing_service._build_header_index`
- `services.maozierp_parallel_auto_listing_service._copy_prepared_auto_listing_profile`
- `services.maozierp_parallel_auto_listing_service._copy_prepared_auto_listing_profile.ignore_profile_junk`
- `services.maozierp_parallel_auto_listing_service._db_path`
- `services.maozierp_parallel_auto_listing_service._ensure_column`
- `services.maozierp_parallel_auto_listing_service._extract_sku_from_url`
- `services.maozierp_parallel_auto_listing_service._is_finished_auto_listing_status`
- `services.maozierp_parallel_auto_listing_service._is_finished_auto_listing_status.genexpr`
- `services.maozierp_parallel_auto_listing_service._job_key`
- `services.maozierp_parallel_auto_listing_service._log`
- `services.maozierp_parallel_auto_listing_service._now`
- `services.maozierp_parallel_auto_listing_service._runtime_root`
- `services.maozierp_parallel_auto_listing_service.build_store_job_groups`
- `services.maozierp_parallel_auto_listing_service.build_store_jobs`
- `services.maozierp_parallel_auto_listing_service.load_pending_rows_from_excel`
- `services.maozierp_parallel_auto_listing_service.normalize_auto_listing_thread_count`
- `services.maozierp_parallel_auto_listing_service.run_parallel_auto_listing`
- `services.maozierp_parallel_auto_listing_service.run_parallel_auto_listing.should_stop`
- `services.maozierp_parallel_auto_listing_service.run_parallel_auto_listing.worker`
- `services.maozierp_parallel_auto_listing_service.run_parallel_auto_listing.worker.mark_group_failed`

### PyInit 反汇编片段

```asm
0x180032d60: lea rcx, [rip + 0x180e9]
0x180032d67: jmp qword ptr [rip + 0xe6c2]
0x180032d6e: int3
0x180032d6f: int3
0x180032d70: push rsi
0x180032d72: sub rsp, 0x30
0x180032d76: mov rsi, rcx
0x180032d79: call qword ptr [rip + 0xe8b1]
0x180032d7f: mov rcx, qword ptr [rax + 0x10]
0x180032d83: call qword ptr [rip + 0xe3af]
0x180032d89: cmp rax, -1
0x180032d8d: je 0x180032dde
0x180032d8f: mov rdx, qword ptr [rip + 0x17faa]
0x180032d96: cmp rdx, -1
0x180032d9a: jne 0x180032dc2
0x180032d9c: mov qword ptr [rip + 0x17f9d], rax
0x180032da3: mov rax, qword ptr [rip + 0x19cc6]
0x180032daa: test rax, rax
0x180032dad: je 0x180032de6
0x180032daf: mov ecx, dword ptr [rax]
0x180032db1: add ecx, 1
0x180032db4: je 0x180032ebd
0x180032dba: mov dword ptr [rax], ecx
0x180032dbc: add rsp, 0x30
0x180032dc0: pop rsi
0x180032dc1: ret
0x180032dc2: cmp rdx, rax
0x180032dc5: je 0x180032da3
0x180032dc7: mov rcx, qword ptr [rip + 0xe6f2]
0x180032dce: lea rdx, [rip + 0xfbeb]
0x180032dd5: mov rcx, qword ptr [rcx]
0x180032dd8: call qword ptr [rip + 0xe40a]
0x180032dde: xor eax, eax
0x180032de0: add rsp, 0x30
0x180032de4: pop rsi
0x180032de5: ret
0x180032de6: mov qword ptr [rsp + 0x40], rbx
0x180032deb: lea rdx, [rip + 0xfc2e]
0x180032df2: mov qword ptr [rsp + 0x48], rbp
0x180032df7: mov rcx, rsi
```

## plugin_bridge_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\plugin_bridge_service.cp312-win_amd64.pyd`
- 大小：99328 bytes
- 入口 RVA：`0x11694`
- 导出：`PyInit_plugin_bridge_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 69632 | 69624 | `0x60000020` |
| `.rdata` | 23552 | 23450 | `0x40000040` |
| `.data` | 2048 | 3616 | `0xc0000040` |
| `.pdata` | 2048 | 2004 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 240 | `0x42000040` |

### Imports

- `python312.dll`：`PyUnicode_Concat`, `PyExc_UnboundLocalError`, `PyDict_GetItemWithError`, `PyInterpreterState_GetID`, `PyObject_GetAttr`, `PyModule_GetName`, `PyObject_HasAttr`, `PyErr_GetRaisedException`, `_Py_NoneStruct`, `PyTuple_New`, `PySequence_Contains`, `PyObject_GenericSetDict`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`

### 可见函数/变量名

- `AHHLII`
- `CythonUnboundCMethod`
- `DisableThreadLibraryCalls`
- `E333L5`
- `E33LE3L5`
- `E3E33L5`
- `E3HuOL5g`
- `E3LED9`
- `E3LEHt`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H3EH3H`
- `H3HEHH`
- `H98tcH`
- `H98tcHA`
- `HEE3IH`
- `HEHHhf`
- `HHHxyOHtH28`
- `HHMH3S`
- `HHt5LH`
- `HHt5LL`
- `HHt9HP`
- `HHtOLIH`
- `HHt_LH`
- `HHto6H`
- `HIHIPHHt`
- `HIPIPPHt`
- `HLHuE3`
- `HME3HAw`
- `HO8DHM`
- `HUHE3LuHLLmP`
- `HUHuE3LmA`
- `HUXE3LeXI`
- `IUgtkt`
- `InitializeSListHead`
- `KJA7KB`
- `LHUMHU`
- `LHtLHH`
- `LHuVA9`
- `LmMHuE3`
- `MHUMHU`
- `QueryPerformanceCounter`
- `SUWAUH`
- `SVWAUAVH`
- `SWAUAVH`
- `SWAUAVH8`
- `UVWATAUAVAWH`
- `VWATAVAWH`
- `WHEX3H`
- `WhQFacK`
- `XsN6EZ`
- `__C_specific_handler`
- `__annotations__`
- `__builtins__`
- `__closure__`
- `__code__`
- `__defaults__`
- `__dict__`
- `__doc__`
- `__file__`
- `__globals__`
- `__kwdefaults__`
- `__loader__`
- `__module__`
- `__name__`
- `__package__`
- `__path__`
- `__qualname__`
- `__reduce__`
- `__std_type_info_destroy_list`
- `__vectorcalloffset__`
- `__weaklistoffset__`
- `_append_background_bridge_if_needed`
- `_append_scraper_bridge_if_needed`
- `_append_snippet_if_needed`
- `_cexit`
- `_configure_narrow_argv`
- `_cython_3_2_4`

### Cython 符号

- `services.plugin_bridge_service`
- `services.plugin_bridge_service._append_background_bridge_if_needed`
- `services.plugin_bridge_service._append_scraper_bridge_if_needed`
- `services.plugin_bridge_service._append_snippet_if_needed`
- `services.plugin_bridge_service._ensure_manifest_permissions`
- `services.plugin_bridge_service._upsert_snippet_by_marker`
- `services.plugin_bridge_service._write_text_if_changed`
- `services.plugin_bridge_service.ensure_plugin_local_log_bridge`

### PyInit 反汇编片段

```asm
0x18000bb10: lea rcx, [rip + 0xcae9]
0x18000bb17: jmp qword ptr [rip + 0x67e2]
0x18000bb1e: int3
0x18000bb1f: int3
0x18000bb20: push rsi
0x18000bb22: sub rsp, 0x30
0x18000bb26: mov rsi, rcx
0x18000bb29: call qword ptr [rip + 0x6989]
0x18000bb2f: mov rcx, qword ptr [rax + 0x10]
0x18000bb33: call qword ptr [rip + 0x6597]
0x18000bb39: cmp rax, -1
0x18000bb3d: je 0x18000bb8e
0x18000bb3f: mov rdx, qword ptr [rip + 0xcab2]
0x18000bb46: cmp rdx, -1
0x18000bb4a: jne 0x18000bb72
0x18000bb4c: mov qword ptr [rip + 0xcaa5], rax
0x18000bb53: mov rax, qword ptr [rip + 0xd2b6]
0x18000bb5a: test rax, rax
0x18000bb5d: je 0x18000bb96
0x18000bb5f: mov ecx, dword ptr [rax]
0x18000bb61: add ecx, 1
0x18000bb64: je 0x18000bc6d
0x18000bb6a: mov dword ptr [rax], ecx
0x18000bb6c: add rsp, 0x30
0x18000bb70: pop rsi
0x18000bb71: ret
0x18000bb72: cmp rdx, rax
0x18000bb75: je 0x18000bb53
0x18000bb77: mov rcx, qword ptr [rip + 0x67f2]
0x18000bb7e: lea rdx, [rip + 0x6d7b]
0x18000bb85: mov rcx, qword ptr [rcx]
0x18000bb88: call qword ptr [rip + 0x65c2]
0x18000bb8e: xor eax, eax
0x18000bb90: add rsp, 0x30
0x18000bb94: pop rsi
0x18000bb95: ret
0x18000bb96: mov qword ptr [rsp + 0x40], rbx
0x18000bb9b: lea rdx, [rip + 0x6dbe]
0x18000bba2: mov qword ptr [rsp + 0x48], rbp
0x18000bba7: mov rcx, rsi
```

## plugin_path_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\plugin_path_service.cp312-win_amd64.pyd`
- 大小：100864 bytes
- 入口 RVA：`0x11b84`
- 导出：`PyInit_plugin_path_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 71168 | 70888 | `0x60000020` |
| `.rdata` | 19456 | 19268 | `0x40000040` |
| `.data` | 5120 | 7088 | `0xc0000040` |
| `.pdata` | 3072 | 2916 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 388 | `0x42000040` |

### Imports

- `python312.dll`：`PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`, `PyObject_Hash`, `PyUnicode_Concat`, `PyExc_UnboundLocalError`, `PyErr_SetNone`, `PyDict_GetItemWithError`, `PyInterpreterState_GetID`, `PyObject_GetAttr`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `Resolve the bundled Maozi ERP browser extension path.\n\nThe packaged extension lives under the application resources directory as\n``plugin``. Because the bridge patch modifies extension files before loading,\nruntime code copies that bund`
- `The packaged extension lives under the application resources directory as`
- `api-ms-win-crt-runtime-l1-1-0.dll`

### 可见函数/变量名

- `AHHLII`
- `AuCQ59`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E3LmIL8`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H3EH3H`
- `H98tcH`
- `H98tcHA`
- `HE0HXH`
- `HE8Le0`
- `HEHEH8`
- `HEHHhf`
- `HEh33L0H0Mt`
- `HEhL0H0Ht`
- `HEhLIF`
- `HFhIML8`
- `HGhHUH`
- `HH9Upu`
- `HHHhH9`
- `HHHxyOHtH28`
- `HHLuhW`
- `HHMh3I`
- `HHt5LH`
- `HHt5LL`
- `HHt9HP`
- `HHtOLIH`
- `HHt_LH`
- `HHto6H`
- `HIHIPHHt`
- `HIPIPPHt`
- `HLEoHUwH`
- `HMHLkXHt`
- `HMHLmHHt`
- `HMoE3H`
- `HMoHUg`
- `HO8DHM`
- `HUE3HEA`
- `HUE3HEI`
- `HUE3LeI`
- `HUE3LmI`
- `HUHuE3LuA`
- `HUXE3HuXI`
- `IEhHUH`
- `IHMPM9o`
- `IICHMsM`
- `InitializeSListHead`
- `LHHhH1Ht`
- `LHuVA9`
- `LUSIkH`
- `LmHUH7`
- `LmHUHL`
- `LmHUHO`
- `LmoHUHMgE3A`
- `LuDLeVL`
- `LugL3HMwIHt`
- `LwHHWPHW8LgXA`
- `MHIIHt`
- `MHMHHt`
- `MHuE3H`
- `QueryPerformanceCounter`
- `SUWAUH`
- `SVWAUAVH`
- `SWAUAVH`
- `SWAUAVH8`
- `USATAUAVAWH`
- `UVWATAUAVAWH`
- `VWATAVAWH`
- `WH0HAhHX`
- `WHUE3I`
- `__C_specific_handler`
- `__annotations__`
- `__builtins__`
- `__closure__`
- `__code__`
- `__defaults__`
- `__dict__`

### Cython 符号

- `services.plugin_path_service`
- `services.plugin_path_service.__pyx_scope_struct_1_genexpr`
- `services.plugin_path_service.__pyx_scope_struct_2__iter_plugin_files`
- `services.plugin_path_service.__pyx_scope_struct_3_genexpr`
- `services.plugin_path_service.__pyx_scope_struct_4__source_signature`
- `services.plugin_path_service.__pyx_scope_struct__is_valid_plugin_dir`
- `services.plugin_path_service._copy_plugin_tree`
- `services.plugin_path_service._iter_plugin_files`
- `services.plugin_path_service._iter_plugin_files.genexpr`
- `services.plugin_path_service._iter_plugin_files.lambda2`
- `services.plugin_path_service._normalize_path`
- `services.plugin_path_service._source_signature`
- `services.plugin_path_service._source_signature.lambda3`
- `services.plugin_path_service.get_bundled_plugin_source_dir`
- `services.plugin_path_service.is_valid_plugin_dir`
- `services.plugin_path_service.is_valid_plugin_dir.genexpr`
- `services.plugin_path_service.prepare_builtin_plugin_dir`
- `services.plugin_path_service.resolve_plugin_dir`

### PyInit 反汇编片段

```asm
0x18000a420: lea rcx, [rip + 0xe9c9]
0x18000a427: jmp qword ptr [rip + 0x8f0a]
0x18000a42e: int3
0x18000a42f: int3
0x18000a430: push rsi
0x18000a432: sub rsp, 0x30
0x18000a436: mov rsi, rcx
0x18000a439: call qword ptr [rip + 0x90d1]
0x18000a43f: mov rcx, qword ptr [rax + 0x10]
0x18000a443: call qword ptr [rip + 0x8cbf]
0x18000a449: cmp rax, -1
0x18000a44d: je 0x18000a49e
0x18000a44f: mov rdx, qword ptr [rip + 0xe7ea]
0x18000a456: cmp rdx, -1
0x18000a45a: jne 0x18000a482
0x18000a45c: mov qword ptr [rip + 0xe7dd], rax
0x18000a463: mov rax, qword ptr [rip + 0xf736]
0x18000a46a: test rax, rax
0x18000a46d: je 0x18000a4a6
0x18000a46f: mov ecx, dword ptr [rax]
0x18000a471: add ecx, 1
0x18000a474: je 0x18000a57d
0x18000a47a: mov dword ptr [rax], ecx
0x18000a47c: add rsp, 0x30
0x18000a480: pop rsi
0x18000a481: ret
0x18000a482: cmp rdx, rax
0x18000a485: je 0x18000a463
0x18000a487: mov rcx, qword ptr [rip + 0x8f32]
0x18000a48e: lea rdx, [rip + 0x971b]
0x18000a495: mov rcx, qword ptr [rcx]
0x18000a498: call qword ptr [rip + 0x8cda]
0x18000a49e: xor eax, eax
0x18000a4a0: add rsp, 0x30
0x18000a4a4: pop rsi
0x18000a4a5: ret
0x18000a4a6: mov qword ptr [rsp + 0x40], rbx
0x18000a4ab: lea rdx, [rip + 0x975e]
0x18000a4b2: mov qword ptr [rsp + 0x48], rbp
0x18000a4b7: mov rcx, rsi
```

## product_text_ocr_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\product_text_ocr_service.cp312-win_amd64.pyd`
- 大小：164864 bytes
- 入口 RVA：`0x207d4`
- 导出：`PyInit_product_text_ocr_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 131584 | 131384 | `0x60000020` |
| `.rdata` | 23552 | 23376 | `0x40000040` |
| `.data` | 4096 | 6776 | `0xc0000040` |
| `.pdata` | 3584 | 3312 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 380 | `0x42000040` |

### Imports

- `python312.dll`：`PyUnicode_AsUTF8AndSize`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`, `PyObject_Hash`, `PyUnicode_Concat`, `PyExc_UnboundLocalError`, `PyErr_SetNone`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `Module 'product_text_ocr_service' has already been imported. Re-initialisation is not supported.`
- `PyInit_product_text_ocr_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `init services.product_text_ocr_service`
- `product_text_ocr_service.cp312-win_amd64.pyd`
- `services/product_text_ocr_service.py`
- `services\product_text_ocr_service.c`

### 可见函数/变量名

- `AHHLII`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E33HMHMLMHLEHUL`
- `E33HMHt`
- `E33Hu0`
- `E33Lm9S`
- `E33LuE3H`
- `E3E33H5`
- `E3E3E3`
- `E3HEIH`
- `E3HELu`
- `E3HEPHP`
- `E3HM3E3Ht`
- `E3HMHt5La`
- `E3HU0I`
- `E3HUAHI`
- `E3Hu0H5B`
- `E3HuLH`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H1HuHt`
- `H3EH3H`
- `H3HE0Is`
- `H3HLHt`
- `H3fHLHt`
- `H98tcH`
- `H98tcHA`
- `HChE3E3IH`
- `HChMIIH`
- `HE0HXH`
- `HE3HEHEHE`
- `HE3HELe`
- `HEHEHu`
- `HEHHhf`
- `HEHHhfff`
- `HEHLHtC9`
- `HEHuKH`
- `HELHMt`
- `HEPHuH`
- `HEh33L8H0Mt`
- `HEhL8H0Ht`
- `HEhLIF`
- `HH9Upu`
- `HHHhH9`
- `HHHxyOHtH28`
- `HHLuhW`
- `HHM0H3`
- `HHMh3I`
- `HHMpH3`
- `HHMxH3S`
- `HHt4LL`
- `HHt5LH`
- `HHt9HP`
- `HHtOLIH`
- `HHt_LH`
- `HHto6H`
- `HHu1E3j`
- `HHuSE3I`
- `HIHIPHHt`
- `HIPIPPHt`
- `HLHtD9`
- `HLMLELHU`
- `HLMLELHUr`
- `HME3Ht`
- `HMHEHt`
- `HMHUHAhH`
- `HMHULB`
- `HMHto9`
- `HML3HEHEHEHHE`
- `HMLuHt`
- `HMhLHEh`
- `HMoLsPHt`
- `HO8DHM`
- `HUE3HEA`
- `HUE3HEI`
- `HUE3HuI`
- `HUE3LeLHu`

### Cython 符号

- `services.product_text_ocr_service`
- `services.product_text_ocr_service.__pyx_scope_struct_1_genexpr`
- `services.product_text_ocr_service.__pyx_scope_struct___is_cuda_runtime_incompatible_error`
- `services.product_text_ocr_service._build_rapidocr_engine_for_mode`
- `services.product_text_ocr_service._cache_key`
- `services.product_text_ocr_service._cache_path`
- `services.product_text_ocr_service._download_image_bytes`
- `services.product_text_ocr_service._get_onnxruntime_available_providers`
- `services.product_text_ocr_service._get_rapidocr_engine`
- `services.product_text_ocr_service._is_cuda_runtime_incompatible_error`
- `services.product_text_ocr_service._is_cuda_runtime_incompatible_error.genexpr`
- `services.product_text_ocr_service._load_cache`
- `services.product_text_ocr_service._load_image_cv2`
- `services.product_text_ocr_service._load_model_runtime_device_preference`
- `services.product_text_ocr_service._normalize_model_runtime_device_value`
- `services.product_text_ocr_service._preload_onnxruntime_cuda_dependencies`
- `services.product_text_ocr_service._resolve_engine_provider_name`
- `services.product_text_ocr_service._save_cache`
- `services.product_text_ocr_service.extract_text_with_rapidocr`
- `services.product_text_ocr_service.normalize_text`

### PyInit 反汇编片段

```asm
0x180015fa0: lea rcx, [rip + 0x12ba9]
0x180015fa7: jmp qword ptr [rip + 0xc3f2]
0x180015fae: int3
0x180015faf: int3
0x180015fb0: push rsi
0x180015fb2: sub rsp, 0x30
0x180015fb6: mov rsi, rcx
0x180015fb9: call qword ptr [rip + 0xc5f9]
0x180015fbf: mov rcx, qword ptr [rax + 0x10]
0x180015fc3: call qword ptr [rip + 0xc157]
0x180015fc9: cmp rax, -1
0x180015fcd: je 0x18001601e
0x180015fcf: mov rdx, qword ptr [rip + 0x12b0a]
0x180015fd6: cmp rdx, -1
0x180015fda: jne 0x180016002
0x180015fdc: mov qword ptr [rip + 0x12afd], rax
0x180015fe3: mov rax, qword ptr [rip + 0x13a7e]
0x180015fea: test rax, rax
0x180015fed: je 0x180016026
0x180015fef: mov ecx, dword ptr [rax]
0x180015ff1: add ecx, 1
0x180015ff4: je 0x1800160fd
0x180015ffa: mov dword ptr [rax], ecx
0x180015ffc: add rsp, 0x30
0x180016000: pop rsi
0x180016001: ret
0x180016002: cmp rdx, rax
0x180016005: je 0x180015fe3
0x180016007: mov rcx, qword ptr [rip + 0xc432]
0x18001600e: lea rdx, [rip + 0xce2b]
0x180016015: mov rcx, qword ptr [rcx]
0x180016018: call qword ptr [rip + 0xc18a]
0x18001601e: xor eax, eax
0x180016020: add rsp, 0x30
0x180016024: pop rsi
0x180016025: ret
0x180016026: mov qword ptr [rsp + 0x40], rbx
0x18001602b: lea rdx, [rip + 0xce6e]
0x180016032: mov qword ptr [rsp + 0x48], rbp
0x180016037: mov rcx, rsi
```

## source_1688_detail_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\source_1688_detail_service.cp312-win_amd64.pyd`
- 大小：424960 bytes
- 入口 RVA：`0x58af4`
- 导出：`PyInit_source_1688_detail_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 361984 | 361560 | `0x60000020` |
| `.rdata` | 44544 | 44234 | `0x40000040` |
| `.data` | 9216 | 17616 | `0xc0000040` |
| `.pdata` | 6656 | 6636 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 1024 | 640 | `0x42000040` |

### Imports

- `python312.dll`：`PyErr_NormalizeException`, `PyObject_SelfIter`, `PyErr_Occurred`, `PyArg_ValidateKeywordArguments`, `PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyNumber_Absolute`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 数据库/状态线索

- `Module 'source_1688_detail_service' has already been imported. Re-initialisation is not supported.`
- `init services.source_1688_detail_service`
- `services/source_1688_detail_service.py`
- `services\source_1688_detail_service.c`
- `source_1688_detail_service.cp312-win_amd64.pyd`

### 业务关键词字符串

- `1688 详情页解析服务`
- `PyInit_source_1688_detail_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`

### 可见函数/变量名

- `AHHLII`
- `CythonUnboundCMethod`
- `DisableThreadLibraryCalls`
- `E33H58`
- `E33HX9`
- `E3D3E3`
- `E3E333HA`
- `E3E33p`
- `E3EAHH`
- `E3HEHH`
- `E3HEPA`
- `E3HEj0`
- `E3HHEHuLu`
- `E3HLeAMHMXAHMEDGpEI`
- `E3HMLuH`
- `E3Ht9MHH`
- `E3Hu0A`
- `E3HuE3`
- `E3HuMHU`
- `E3IHEHuLum`
- `E3LHELu`
- `E3LLmH`
- `E3LMD9`
- `E3LeLHuHUHL`
- `E3LeLLmHUH`
- `E3LmMt`
- `E3MHEXHuP`
- `E3MuKH`
- `E3QE3E33`
- `FHAHt28`
- `FLUAUAVI`
- `GHGpHH`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `GlhNHweo0`
- `H0L0Ht`
- `H1HuHt`
- `H3EH3H`
- `H3HEIs`
- `H3HEpH`
- `H3HLHt`
- `H3HLPHt`
- `H3HLXHt`
- `H3fHLHt`
- `H83HEHt`
- `H98tcH`
- `H98tcHA`
- `HBhE3E3H`
- `HEHEHEHE`
- `HEHEHEHE9`
- `HEHEHEHEHEHEHEHEHt`
- `HEHEHEHEM`
- `HEHEHt`
- `HEHHMt`
- `HEHHhf`
- `HEHUE3HEA`
- `HELHHt`
- `HELLMt`
- `HEh33L0H0Mt`
- `HEhL0H0Ht`
- `HEhLIF`
- `HEpLmh`
- `HExHup`
- `HH9Upu`
- `HHE3HEH`
- `HHEH4H`
- `HHEH9E3Hu`
- `HHEHHhfL9Mt`
- `HHHhH9`
- `HHHxyOHtH28`
- `HHLuhW`
- `HHM8H3R`
- `HHMH3G`
- `HHMHHHt`
- `HHMh3I`
- `HHMoHA`
- `HHMpH3n`
- `HHUH3I`
- `HHt5LH`

### Cython 符号

- `services.source_1688_detail_service`
- `services.source_1688_detail_service.__defaults__`
- `services.source_1688_detail_service.__pyx_defaults`
- `services.source_1688_detail_service.__pyx_scope_struct_10_genexpr`
- `services.source_1688_detail_service.__pyx_scope_struct_1_genexpr`
- `services.source_1688_detail_service.__pyx_scope_struct_2_genexpr`
- `services.source_1688_detail_service.__pyx_scope_struct_3_is_free_shipping_text`
- `services.source_1688_detail_service.__pyx_scope_struct_4_genexpr`
- `services.source_1688_detail_service.__pyx_scope_struct_5__iter_nested_texts`
- `services.source_1688_detail_service.__pyx_scope_struct_6_extract_min_order_meta`
- `services.source_1688_detail_service.__pyx_scope_struct_7_genexpr`
- `services.source_1688_detail_service.__pyx_scope_struct_8_extract_detail_page_data`
- `services.source_1688_detail_service.__pyx_scope_struct_9_genexpr`
- `services.source_1688_detail_service.__pyx_scope_struct__looks_like_freight_text`
- `services.source_1688_detail_service._coerce_freight_number`
- `services.source_1688_detail_service._coerce_json_dict`
- `services.source_1688_detail_service._coerce_positive_number`
- `services.source_1688_detail_service._extract_min_number_from_items`
- `services.source_1688_detail_service._extract_ozon_description`
- `services.source_1688_detail_service._extract_ozon_json_ld_product`
- `services.source_1688_detail_service._extract_ozon_meta`
- `services.source_1688_detail_service._extract_ozon_size_text`
- `services.source_1688_detail_service._extract_size_tokens`
- `services.source_1688_detail_service._iter_json_object_candidates`
- `services.source_1688_detail_service._iter_nested_texts`
- `services.source_1688_detail_service._normalize_min_order_unit`
- `services.source_1688_detail_service._normalize_quantity_text`
- `services.source_1688_detail_service._truncate_for_json_log`
- `services.source_1688_detail_service.build_ozon_snapshot_from_data`
- `services.source_1688_detail_service.build_package_size_text`
- `services.source_1688_detail_service.build_variant_detail_url`
- `services.source_1688_detail_service.build_variant_image_lookup`
- `services.source_1688_detail_service.build_variant_match_prompt`
- `services.source_1688_detail_service.build_variant_package_lookup`
- `services.source_1688_detail_service.build_variant_records`
- `services.source_1688_detail_service.choose_best_variant_with_text_model`
- `services.source_1688_detail_service.clean_spec_text`
- `services.source_1688_detail_service.enrich_variants_with_image_ocr_text`
- `services.source_1688_detail_service.extract_detail_page_data`
- `services.source_1688_detail_service.extract_detail_page_data.genexpr`
- `services.source_1688_detail_service.extract_freight_amount`
- `services.source_1688_detail_service.extract_freight_meta`
- `services.source_1688_detail_service.extract_json_object`
- `services.source_1688_detail_service.extract_message_text`
- `services.source_1688_detail_service.extract_min_order_meta`
- `services.source_1688_detail_service.extract_min_order_meta.genexpr`
- `services.source_1688_detail_service.extract_min_order_quantity`
- `services.source_1688_detail_service.extract_min_order_text`
- `services.source_1688_detail_service.extract_offer_detail_summary`
- `services.source_1688_detail_service.extract_variant_image_ocr_text`
- `services.source_1688_detail_service.extract_window_context_payload_from_driver`
- `services.source_1688_detail_service.find_variant_image_url`
- `services.source_1688_detail_service.first_non_empty`
- `services.source_1688_detail_service.format_compact_number`
- `services.source_1688_detail_service.get_dashscope_api_key_candidates`
- `services.source_1688_detail_service.is_free_shipping_text`
- `services.source_1688_detail_service.is_free_shipping_text.genexpr`
- `services.source_1688_detail_service.limit_variants_for_analysis`
- `services.source_1688_detail_service.looks_like_freight_text`
- `services.source_1688_detail_service.looks_like_freight_text.genexpr`
- `services.source_1688_detail_service.match_variant_from_extracted_detail_data`
- `services.source_1688_detail_service.match_variant_from_extracted_detail_data.genexpr`
- `services.source_1688_detail_service.normalize_quantity_multiplier`
- `services.source_1688_detail_service.normalize_space`
- `services.source_1688_detail_service.normalize_text`
- `services.source_1688_detail_service.parse_float_or_none`
- `services.source_1688_detail_service.parse_model_json_response`
- `services.source_1688_detail_service.parse_window_context_payload`
- `services.source_1688_detail_service.post_qwen_text`
- `services.source_1688_detail_service.resolve_detail_variant_ocr_worker_count`
- `services.source_1688_detail_service.synthesize_min_order_text`
- `services.source_1688_detail_service.truncate_text`

### PyInit 反汇编片段

```asm
0x180048150: lea rcx, [rip + 0x1e499]
0x180048157: jmp qword ptr [rip + 0x12332]
0x18004815e: int3
0x18004815f: int3
0x180048160: push rsi
0x180048162: sub rsp, 0x30
0x180048166: mov rsi, rcx
0x180048169: call qword ptr [rip + 0x12549]
0x18004816f: mov rcx, qword ptr [rax + 0x10]
0x180048173: call qword ptr [rip + 0x11fe7]
0x180048179: cmp rax, -1
0x18004817d: je 0x1800481ce
0x18004817f: mov rdx, qword ptr [rip + 0x1dfba]
0x180048186: cmp rdx, -1
0x18004818a: jne 0x1800481b2
0x18004818c: mov qword ptr [rip + 0x1dfad], rax
0x180048193: mov rax, qword ptr [rip + 0x21326]
0x18004819a: test rax, rax
0x18004819d: je 0x1800481d6
0x18004819f: mov ecx, dword ptr [rax]
0x1800481a1: add ecx, 1
0x1800481a4: je 0x1800482ad
0x1800481aa: mov dword ptr [rax], ecx
0x1800481ac: add rsp, 0x30
0x1800481b0: pop rsi
0x1800481b1: ret
0x1800481b2: cmp rdx, rax
0x1800481b5: je 0x180048193
0x1800481b7: mov rcx, qword ptr [rip + 0x12372]
0x1800481be: lea rdx, [rip + 0x142ab]
0x1800481c5: mov rcx, qword ptr [rcx]
0x1800481c8: call qword ptr [rip + 0x12042]
0x1800481ce: xor eax, eax
0x1800481d0: add rsp, 0x30
0x1800481d4: pop rsi
0x1800481d5: ret
0x1800481d6: mov qword ptr [rsp + 0x40], rbx
0x1800481db: lea rdx, [rip + 0x142ee]
0x1800481e2: mov qword ptr [rsp + 0x48], rbp
0x1800481e7: mov rcx, rsi
```

## source_1688_prompt_constants.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\source_1688_prompt_constants.cp312-win_amd64.pyd`
- 大小：22016 bytes
- 入口 RVA：`0x26c4`
- 导出：`PyInit_source_1688_prompt_constants`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 8704 | 8216 | `0x60000020` |
| `.rdata` | 10240 | 9900 | `0x40000040` |
| `.data` | 512 | 840 | `0xc0000040` |
| `.pdata` | 512 | 504 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 72 | `0x42000040` |

### Imports

- `python312.dll`：`PyDict_Type`, `PyModule_NewObject`, `PyType_IsSubtype`, `_Py_Dealloc`, `PyImport_GetModuleDict`, `PyModule_GetDict`, `PyErr_ExceptionMatches`, `PyObject_CallFunctionObjArgs`, `Py_Version`, `PyImport_AddModule`, `PyObject_GetAttrString`, `PyErr_Clear`
- `KERNEL32.dll`：`QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `DisableThreadLibraryCalls`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`__C_specific_handler`, `__std_type_info_destroy_list`, `memcpy`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initterm`, `_execute_onexit_table`, `_cexit`, `_initialize_onexit_table`

### 数据库/状态线索

- `Module 'source_1688_prompt_constants' has already been imported. Re-initialisation is not supported.`
- `init services.source_1688_prompt_constants`
- `services/source_1688_prompt_constants.py`
- `services\source_1688_prompt_constants.c`
- `source_1688_prompt_constants.cp312-win_amd64.pyd`

### 业务关键词字符串

- `1688 全链路提示词模板常量`
- `PyInit_source_1688_prompt_constants`
- `PyObject_VectorcallDict`
- `api-ms-win-crt-runtime-l1-1-0.dll`

### 可见函数/变量名

- `DisableThreadLibraryCalls`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H3EH3H`
- `H3HEPH`
- `HHt5LH`
- `HHt_LH`
- `InitializeSListHead`
- `QueryPerformanceCounter`
- `Richv1`
- `__C_specific_handler`
- `__builtins__`
- `__file__`
- `__loader__`
- `__package__`
- `__path__`
- `__std_type_info_destroy_list`
- `_cexit`
- `_configure_narrow_argv`
- `_execute_onexit_table`
- `_initialize_narrow_environment`
- `_initialize_onexit_table`
- `_initterm`
- `_initterm_e`
- `_seh_filter_dll`
- `builtins`
- `cython_runtime`
- `decompress`
- `l4AvDm5`
- `lnnnlO`
- `loader`
- `memcpy`
- `ntelineI`
- `origin`
- `parent`
- `source_1688_prompt_constants`
- `submodule_search_locations`
- `u6u2L3Iz`
- `xMkOr8T`

### Cython 符号

- `services.source_1688_prompt_constants`

### PyInit 反汇编片段

```asm
0x180001000: lea rcx, [rip + 0x60b9]
0x180001007: jmp qword ptr [rip + 0x311a]
0x18000100e: int3
0x18000100f: int3
0x180001010: push rsi
0x180001012: sub rsp, 0x30
0x180001016: mov rsi, rcx
0x180001019: call qword ptr [rip + 0x3219]
0x18000101f: mov rcx, qword ptr [rax + 0x10]
0x180001023: call qword ptr [rip + 0x319f]
0x180001029: cmp rax, -1
0x18000102d: je 0x18000107e
0x18000102f: mov rdx, qword ptr [rip + 0x607a]
0x180001036: cmp rdx, -1
0x18000103a: jne 0x180001062
0x18000103c: mov qword ptr [rip + 0x606d], rax
0x180001043: mov rax, qword ptr [rip + 0x62ee]
0x18000104a: test rax, rax
0x18000104d: je 0x180001086
0x18000104f: mov ecx, dword ptr [rax]
0x180001051: add ecx, 1
0x180001054: je 0x18000115d
0x18000105a: mov dword ptr [rax], ecx
0x18000105c: add rsp, 0x30
0x180001060: pop rsi
0x180001061: ret
0x180001062: cmp rdx, rax
0x180001065: je 0x180001043
0x180001067: mov rcx, qword ptr [rip + 0x30e2]
0x18000106e: lea rdx, [rip + 0x330b]
0x180001075: mov rcx, qword ptr [rcx]
0x180001078: call qword ptr [rip + 0x311a]
0x18000107e: xor eax, eax
0x180001080: add rsp, 0x30
0x180001084: pop rsi
0x180001085: ret
0x180001086: mov qword ptr [rsp + 0x40], rbx
0x18000108b: lea rdx, [rip + 0x334e]
0x180001092: mov qword ptr [rsp + 0x48], rbp
0x180001097: mov rcx, rsi
```

## source_1688_scratch_captcha_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\source_1688_scratch_captcha_service.cp312-win_amd64.pyd`
- 大小：435712 bytes
- 入口 RVA：`0x5c114`
- 导出：`PyInit_source_1688_scratch_captcha_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 375808 | 375416 | `0x60000020` |
| `.rdata` | 44544 | 44060 | `0x40000040` |
| `.data` | 6656 | 14968 | `0xc0000040` |
| `.pdata` | 6144 | 6132 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 1024 | 572 | `0x42000040` |

### Imports

- `python312.dll`：`PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyList_Sort`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 数据库/状态线索

- `Module 'source_1688_scratch_captcha_service' has already been imported. Re-initialisation is not supported.`
- `init services.source_1688_scratch_captcha_service`
- `services/source_1688_scratch_captcha_service.py`
- `services\source_1688_scratch_captcha_service.c`
- `source_1688_scratch_captcha_service.cp312-win_amd64.pyd`

### 业务关键词字符串

- ` test/test_yolo_image.py `
- `1688 详情页刮刮乐滑块验证服务`
- `PyInit_source_1688_scratch_captcha_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `本模块已按 test/test_yolo_image.py 的最新逻辑实现`

### 可见函数/变量名

- `AHHLII`
- `BE3E33H`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E3333LA`
- `E33E3q`
- `E33HLHt`
- `E33HMHMLMHLEHU0`
- `E33LuE3H`
- `E3E33B`
- `E3E33C`
- `E3E33D`
- `E3E33H`
- `E3E33H5`
- `E3E33H7`
- `E3E33HU`
- `E3E3Lu0I`
- `E3E3LuI`
- `E3EAHH`
- `E3HApH`
- `E3HEH8`
- `E3HEHh`
- `E3HM3B4`
- `E3HMHt8Li`
- `E3HMLuH`
- `E3HuE33`
- `E3HuGH`
- `E3HuLe`
- `E3IHEPHuHLmX`
- `E3L5kG`
- `E3LEHH`
- `E3LEIHE`
- `E3LLJY`
- `E3LLqt`
- `E3LMILEHU8`
- `E3LeE3`
- `E3LmLLuHUIIlr`
- `E3LmLmLm`
- `E3LmMHuHUH`
- `Et_HyZH`
- `FHAHt28`
- `FLUSIkHH`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H3E3E32`
- `H3EH3H`
- `H3HEE3H`
- `H3HEIs`
- `H3HExIs`
- `H3HLHt`
- `H3HLPHt`
- `H3fHLHt`
- `H98tcH`
- `H98tcHA`
- `HBh33H`
- `HChIHuH`
- `HE0HXH`
- `HE3E3m`
- `HE3HEHEHE`
- `HE3HMAHE`
- `HEE3HH`
- `HEHHhH1Ht`
- `HEHHhH1HuHt`
- `HEHHhL1Mt`
- `HEHHhf`
- `HEHHhfff`
- `HEHLHu`
- `HEHUHE3HEPA`
- `HEHUPE3HEPI`
- `HEh33L0H0Mt`
- `HEhL0H0Ht`
- `HEhLIF`
- `HFhH0L0Ht`
- `HH9Upu`
- `HHELMLLEHU`
- `HHELMLLEHUx`
- `HHHhH9`
- `HHHxyOHtH28`

### Cython 符号

- `services.source_1688_scratch_captcha_service`
- `services.source_1688_scratch_captcha_service.__pyx_scope_struct_1_genexpr`
- `services.source_1688_scratch_captcha_service.__pyx_scope_struct_2_scratch_captcha_solved`
- `services.source_1688_scratch_captcha_service.__pyx_scope_struct_3_genexpr`
- `services.source_1688_scratch_captcha_service.__pyx_scope_struct_4_genexpr`
- `services.source_1688_scratch_captcha_service.__pyx_scope_struct___is_cuda_runtime_incompatible_error`
- `services.source_1688_scratch_captcha_service._build_drag_distance_candidates`
- `services.source_1688_scratch_captcha_service._capture_canvas_data_url`
- `services.source_1688_scratch_captcha_service._capture_element_screenshot_data_url`
- `services.source_1688_scratch_captcha_service._coerce_json_dict`
- `services.source_1688_scratch_captcha_service._extract_json_object`
- `services.source_1688_scratch_captcha_service._extract_message_text`
- `services.source_1688_scratch_captcha_service._extract_status_code`
- `services.source_1688_scratch_captcha_service._force_yolo_cpu_device`
- `services.source_1688_scratch_captcha_service._has_scratch_captcha_in_dom`
- `services.source_1688_scratch_captcha_service._is_auth_error`
- `services.source_1688_scratch_captcha_service._is_cuda_runtime_incompatible_error`
- `services.source_1688_scratch_captcha_service._is_cuda_runtime_incompatible_error.genexpr`
- `services.source_1688_scratch_captcha_service._is_probably_dashscope_key`
- `services.source_1688_scratch_captcha_service._load_model_runtime_device_preference`
- `services.source_1688_scratch_captcha_service._log`
- `services.source_1688_scratch_captcha_service._mark_dashscope_key_bad`
- `services.source_1688_scratch_captcha_service._mark_dashscope_key_good`
- `services.source_1688_scratch_captcha_service._maybe_get_page`
- `services.source_1688_scratch_captcha_service._model_name_map`
- `services.source_1688_scratch_captcha_service._move_yolo_model_to_gpu`
- `services.source_1688_scratch_captcha_service._move_yolo_model_to_runtime_device`
- `services.source_1688_scratch_captcha_service._normalize_model_runtime_device_value`
- `services.source_1688_scratch_captcha_service._require_cuda_for_yolo`
- `services.source_1688_scratch_captcha_service._require_page`
- `services.source_1688_scratch_captcha_service._resolve_yolo_runtime_device`
- `services.source_1688_scratch_captcha_service.ask_qwen_pick_detected_class`
- `services.source_1688_scratch_captcha_service.ask_qwen_vl`
- `services.source_1688_scratch_captcha_service.ask_qwen_vl_with_choices`
- `services.source_1688_scratch_captcha_service.base64_to_cv2`
- `services.source_1688_scratch_captcha_service.build_human_drag_steps`
- `services.source_1688_scratch_captcha_service.captcha_response_data_ready`
- `services.source_1688_scratch_captcha_service.capture_captcha_listener_packets`
- `services.source_1688_scratch_captcha_service.collect_captcha_response_data`
- `services.source_1688_scratch_captcha_service.collect_visible_elements`
- `services.source_1688_scratch_captcha_service.extract_captcha_response_data`
- `services.source_1688_scratch_captcha_service.find_first_visible`
- `services.source_1688_scratch_captcha_service.first_non_empty`
- `services.source_1688_scratch_captcha_service.get_app_dir`
- `services.source_1688_scratch_captcha_service.get_dashscope_api_key_candidates`
- `services.source_1688_scratch_captcha_service.get_slider_geometry`
- `services.source_1688_scratch_captcha_service.has_scratch_captcha`
- `services.source_1688_scratch_captcha_service.infer_slider_target_percent`
- `services.source_1688_scratch_captcha_service.infer_slider_target_percent.lambda1`
- `services.source_1688_scratch_captcha_service.infer_slider_target_percent.lambda2`
- `services.source_1688_scratch_captcha_service.load_yolo_model_cached`
- `services.source_1688_scratch_captcha_service.normalize_prompt_text`
- `services.source_1688_scratch_captcha_service.normalize_text`
- `services.source_1688_scratch_captcha_service.refresh_scratch_captcha`
- `services.source_1688_scratch_captcha_service.resolve_default_model_path`
- `services.source_1688_scratch_captcha_service.resolve_target_key`
- `services.source_1688_scratch_captcha_service.scratch_captcha_solved`
- `services.source_1688_scratch_captcha_service.scratch_captcha_solved.genexpr`
- `services.source_1688_scratch_captcha_service.solve_scratch_captcha_if_present`
- `services.source_1688_scratch_captcha_service.solve_slider_by_percent`
- `services.source_1688_scratch_captcha_service.start_captcha_listener`

### PyInit 反汇编片段

```asm
0x18004b400: lea rcx, [rip + 0x1dd49]
0x18004b407: jmp qword ptr [rip + 0x1203a]
0x18004b40e: int3
0x18004b40f: int3
0x18004b410: push rsi
0x18004b412: sub rsp, 0x30
0x18004b416: mov rsi, rcx
0x18004b419: call qword ptr [rip + 0x12259]
0x18004b41f: mov rcx, qword ptr [rax + 0x10]
0x18004b423: call qword ptr [rip + 0x11d17]
0x18004b429: cmp rax, -1
0x18004b42d: je 0x18004b47e
0x18004b42f: mov rdx, qword ptr [rip + 0x1d82a]
0x18004b436: cmp rdx, -1
0x18004b43a: jne 0x18004b462
0x18004b43c: mov qword ptr [rip + 0x1d81d], rax
0x18004b443: mov rax, qword ptr [rip + 0x2061e]
0x18004b44a: test rax, rax
0x18004b44d: je 0x18004b486
0x18004b44f: mov ecx, dword ptr [rax]
0x18004b451: add ecx, 1
0x18004b454: je 0x18004b55d
0x18004b45a: mov dword ptr [rax], ecx
0x18004b45c: add rsp, 0x30
0x18004b460: pop rsi
0x18004b461: ret
0x18004b462: cmp rdx, rax
0x18004b465: je 0x18004b443
0x18004b467: mov rcx, qword ptr [rip + 0x1207a]
0x18004b46e: lea rdx, [rip + 0x13cbb]
0x18004b475: mov rcx, qword ptr [rcx]
0x18004b478: call qword ptr [rip + 0x11d6a]
0x18004b47e: xor eax, eax
0x18004b480: add rsp, 0x30
0x18004b484: pop rsi
0x18004b485: ret
0x18004b486: mov qword ptr [rsp + 0x40], rbx
0x18004b48b: lea rdx, [rip + 0x13cfe]
0x18004b492: mov qword ptr [rsp + 0x48], rbp
0x18004b497: mov rcx, rsi
```

## source_1688_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\source_1688_service.cp312-win_amd64.pyd`
- 大小：1229312 bytes
- 入口 RVA：`0x10fb94`
- 导出：`PyInit_source_1688_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 1111552 | 1111384 | `0x60000020` |
| `.rdata` | 86016 | 85612 | `0x40000040` |
| `.data` | 16896 | 35352 | `0xc0000040` |
| `.pdata` | 11776 | 11436 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 1536 | 1116 | `0x42000040` |

### Imports

- `python312.dll`：`PyErr_Occurred`, `PyArg_ValidateKeywordArguments`, `PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyNumber_Remainder`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyNumber_Absolute`, `PyTraceBack_Here`, `PyList_SetSlice`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 数据库/状态线索

- `Module 'source_1688_service' has already been imported. Re-initialisation is not supported.`
- `init services.source_1688_service`
- `services/source_1688_service.py`
- `services\source_1688_service.c`
- `source_1688_service.cp312-win_amd64.pyd`

### 业务关键词字符串

- ` 1688 `
- `1688 货源搜索主服务`
- `PyInit_source_1688_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `不访问1688页面`
- `仅负责在 1688 图搜页中拿回候选列表`
- `候选匹配与最终货源决策`

### 可见函数/变量名

- `AHHLII`
- `BMftAF`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DLEDLC`
- `DisableThreadLibraryCalls`
- `E33DD5`
- `E33E3A`
- `E33E3L5N`
- `E33E3f`
- `E33HEe`
- `E33HMHMLMHLEHU`
- `E33HMHMLMHLEHUJ`
- `E33HMHMLMHLEHUw`
- `E33LeK`
- `E33Lm3HMH`
- `E3E333`
- `E3E3333HEHEMt`
- `E3E33E3EtAA`
- `E3E33H3`
- `E3E33HJ`
- `E3E33Hb`
- `E3E33I`
- `E3E33Y`
- `E3E3E3LH`
- `E3E3H5`
- `E3E3H5v`
- `E3E3HEA`
- `E3E3HT`
- `E3E3HT8`
- `E3E3Hk`
- `E3E3Hue`
- `E3E3LX`
- `E3E3Le`
- `E3E3Tn`
- `E3EAHH`
- `E3EEfH`
- `E3HE0A`
- `E3HE0I`
- `E3HEE33E3`
- `E3HEHELmLmLmHt`
- `E3HELu`
- `E3HELuHLuLuMt`
- `E3HM3e`
- `E3HMHt9Li`
- `E3HULH`
- `E3HUPI`
- `E3HUXI`
- `E3HUhI`
- `E3HUpI`
- `E3HhHHp3Hx3A`
- `E3Hu3Ht`
- `E3Hu8A`
- `E3HuHUHFhH`
- `E3Hunp`
- `E3HxLI`
- `E3IFhHUH`
- `E3IGhH`
- `E3IHELeHu`
- `E3ILuLeHt`
- `E3IME33HD`
- `E3LAAM`
- `E3LEHH`
- `E3LEHH0`
- `E3LEHHE`
- `E3LEIH`
- `E3LEIHE`
- `E3LMILEHU`
- `E3LMILEHU3`
- `E3LMLM`
- `E3LeMHuHUI`
- `E3LeMLuHUIC`
- `E3LmLLeHUH`
- `E3LmMLeHUI_`
- `E3Lu0A`
- `E3LuHt`
- `E3LuLu`
- `E3MHE8Lu0`
- `E3MHEPLmH`
- `Et_HyZH`

### Cython 符号

- `services.source_1688_service`
- `services.source_1688_service.Source1688AccessBlockedError.__init__`
- `services.source_1688_service.Source1688BrowserRestartRequiredError.__init__`
- `services.source_1688_service.__defaults__`
- `services.source_1688_service.__pyx_defaults`
- `services.source_1688_service.__pyx_defaults1`
- `services.source_1688_service.__pyx_scope_struct_10_genexpr`
- `services.source_1688_service.__pyx_scope_struct_11_genexpr`
- `services.source_1688_service.__pyx_scope_struct_12_looks_like_freight_text`
- `services.source_1688_service.__pyx_scope_struct_13_genexpr`
- `services.source_1688_service.__pyx_scope_struct_14_genexpr`
- `services.source_1688_service.__pyx_scope_struct_15_extract_freight_amount`
- `services.source_1688_service.__pyx_scope_struct_16_genexpr`
- `services.source_1688_service.__pyx_scope_struct_17_is_single_piece_min_order`
- `services.source_1688_service.__pyx_scope_struct_18_genexpr`
- `services.source_1688_service.__pyx_scope_struct_19_detail_page_ready`
- `services.source_1688_service.__pyx_scope_struct_1__estimate_slider_drag_distance`
- `services.source_1688_service.__pyx_scope_struct_20_genexpr`
- `services.source_1688_service.__pyx_scope_struct_2_genexpr`
- `services.source_1688_service.__pyx_scope_struct_3_genexpr`
- `services.source_1688_service.__pyx_scope_struct_4_genexpr`
- `services.source_1688_service.__pyx_scope_struct_5_genexpr`
- `services.source_1688_service.__pyx_scope_struct_6_genexpr`
- `services.source_1688_service.__pyx_scope_struct_7_genexpr`
- `services.source_1688_service.__pyx_scope_struct_8_genexpr`
- `services.source_1688_service.__pyx_scope_struct_9_genexpr`
- `services.source_1688_service.__pyx_scope_struct___find_first_visible_element`
- `services.source_1688_service._attach_reusable_detail_driver`
- `services.source_1688_service._build_human_drag_steps`
- `services.source_1688_service._build_human_drag_steps.genexpr`
- `services.source_1688_service._build_login_style_slider_drag_steps`
- `services.source_1688_service._build_login_style_slider_drag_steps.genexpr`
- `services.source_1688_service._build_simple_unlock_drag_steps`
- `services.source_1688_service._build_source_match_result`
- `services.source_1688_service._calculate_average_vector_similarity`
- `services.source_1688_service._check_slider_solved_after_drag`
- `services.source_1688_service._clamp_slider_drag_distance`
- `services.source_1688_service._cookie_base_url`
- `services.source_1688_service._copy_1688_session_cookies`
- `services.source_1688_service._create_isolated_drission_detail_driver`
- `services.source_1688_service._detach_reusable_detail_driver`
- `services.source_1688_service._detail_poll_next_sleep`
- `services.source_1688_service._detail_sleep_with_jitter`
- `services.source_1688_service._dispatch_simple_slider_retry_click_via_js`
- `services.source_1688_service._driver_session_alive`
- `services.source_1688_service._estimate_slider_drag_distance`
- `services.source_1688_service._estimate_slider_drag_distance._unwrap`
- `services.source_1688_service._estimate_slider_drag_distance._width_of`
- `services.source_1688_service._extract_model_ozon_image_text_payload`
- `services.source_1688_service._find_first_visible_element`
- `services.source_1688_service._find_first_visible_element._is_displayed`
- `services.source_1688_service._find_first_visible_element._size_of`
- `services.source_1688_service._find_first_visible_element._unwrap`
- `services.source_1688_service._get_attached_reusable_detail_driver`
- `services.source_1688_service._get_login_state_signature`
- `services.source_1688_service._is_drission_1688_driver`
- `services.source_1688_service._is_simple_nocaptcha_slider`
- `services.source_1688_service._iter_json_object_candidates`
- `services.source_1688_service._locate_slider_element`
- `services.source_1688_service._locate_slider_track_element`
- `services.source_1688_service._mark_detail_driver_active`
- `services.source_1688_service._navigate_detail_url`
- `services.source_1688_service._normalize_cookie_for_webdriver`
- `services.source_1688_service._normalize_model_ocr_segments`
- `services.source_1688_service._normalize_quantity_text`
- `services.source_1688_service._normalize_similarity_score`
- `services.source_1688_service._normalize_vector_similarity_score`
- `services.source_1688_service._prepare_detail_driver_for_scratch`
- `services.source_1688_service._prewarm_detail_driver_login_state`
- `services.source_1688_service._resolve_image_upload_input_with_refresh_retries`
- `services.source_1688_service._resolve_stage4_image_build_max_workers`
- `services.source_1688_service._resolve_stage4_light_image_max_side`
- `services.source_1688_service._resolve_stage4_llm_min_similarity_score`
- `services.source_1688_service._resolve_stage4_vector_discard_below`
- `services.source_1688_service._resolve_stage4_vector_top1_only_min`
- `services.source_1688_service._resolve_stage4_vector_top1_top2_gap_min`
- `services.source_1688_service._resolve_variant_by_sku_from_extracted_detail_data`
- `services.source_1688_service._resolve_vector_top_k_by_provider`
- `services.source_1688_service._route_stage4_llm_candidates`
- `services.source_1688_service._throttle_detail_navigation`

### PyInit 反汇编片段

```asm
0x1800f35f0: lea rcx, [rip + 0x35279]
0x1800f35f7: jmp qword ptr [rip + 0x1deaa]
0x1800f35fe: int3
0x1800f35ff: int3
0x1800f3600: push rsi
0x1800f3602: sub rsp, 0x30
0x1800f3606: mov rsi, rcx
0x1800f3609: call qword ptr [rip + 0x1e0f1]
0x1800f360f: mov rcx, qword ptr [rax + 0x10]
0x1800f3613: call qword ptr [rip + 0x1db47]
0x1800f3619: cmp rax, -1
0x1800f361d: je 0x1800f366e
0x1800f361f: mov rdx, qword ptr [rip + 0x346fa]
0x1800f3626: cmp rdx, -1
0x1800f362a: jne 0x1800f3652
0x1800f362c: mov qword ptr [rip + 0x346ed], rax
0x1800f3633: mov rax, qword ptr [rip + 0x3b3ce]
0x1800f363a: test rax, rax
0x1800f363d: je 0x1800f3676
0x1800f363f: mov ecx, dword ptr [rax]
0x1800f3641: add ecx, 1
0x1800f3644: je 0x1800f374d
0x1800f364a: mov dword ptr [rax], ecx
0x1800f364c: add rsp, 0x30
0x1800f3650: pop rsi
0x1800f3651: ret
0x1800f3652: cmp rdx, rax
0x1800f3655: je 0x1800f3633
0x1800f3657: mov rcx, qword ptr [rip + 0x1defa]
0x1800f365e: lea rdx, [rip + 0x223ab]
0x1800f3665: mov rcx, qword ptr [rcx]
0x1800f3668: call qword ptr [rip + 0x1dbba]
0x1800f366e: xor eax, eax
0x1800f3670: add rsp, 0x30
0x1800f3674: pop rsi
0x1800f3675: ret
0x1800f3676: mov qword ptr [rsp + 0x40], rbx
0x1800f367b: lea rdx, [rip + 0x223ee]
0x1800f3682: mov qword ptr [rsp + 0x48], rbp
0x1800f3687: mov rcx, rsi
```

## source_1688_third_party_api_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\source_1688_third_party_api_service.cp312-win_amd64.pyd`
- 大小：155648 bytes
- 入口 RVA：`0x1dc94`
- 导出：`PyInit_source_1688_third_party_api_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 120320 | 120312 | `0x60000020` |
| `.rdata` | 25600 | 25218 | `0x40000040` |
| `.data` | 4096 | 6728 | `0xc0000040` |
| `.pdata` | 3584 | 3528 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 396 | `0x42000040` |

### Imports

- `python312.dll`：`PyLong_FromSsize_t`, `PyUnicode_DecodeUTF8`, `PyObject_GenericGetAttr`, `PyUnicode_AsUTF8AndSize`, `PyTraceBack_Here`, `_PyThreadState_UncheckedGet`, `PyExc_RuntimeError`, `PyMethod_New`, `PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`, `PyObject_Hash`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 数据库/状态线索

- ` Onebound item_get `
- `Module 'source_1688_third_party_api_service' has already been imported. Re-initialisation is not supported.`
- `init services.source_1688_third_party_api_service`
- `services/source_1688_third_party_api_service.py`
- `services\source_1688_third_party_api_service.c`
- `source_1688_third_party_api_service.cp312-win_amd64.pyd`
- `将 Onebound item_get 返回值转换为本项目详情页解析后的统一结构`

### 业务关键词字符串

- `    detail_summary: {...},`
- `    detail_url: "...",`
- `    preferred_search_sku_id: "..."`
- `    variant_count: int,`
- `    variant_total_count: int,`
- `    variants: [...],`
- `1688 第三方详情 API 适配层`
- `PyInit_source_1688_third_party_api_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `{\n    detail_summary: {...},\n    detail_url: "...",\n    variants: [...],\n    variant_count: int,\n    variant_total_count: int,\n    preferred_search_sku_id: "..."\n}`

### 可见函数/变量名

- `AHHLII`
- `CythonUnboundCMethod`
- `DHMHHt`
- `DisableThreadLibraryCalls`
- `E33H8A`
- `E3EAHH`
- `E3HLM8H`
- `E3HuLe`
- `E3LHExHup`
- `E3LmL9i`
- `E3LuIH`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H3EH3H`
- `H98tcH`
- `H98tcHA`
- `HE0HXH`
- `HEHHhH9Ht`
- `HELHEHu`
- `HEXHuP`
- `HEgHHu`
- `HEgLHu`
- `HEhLIF`
- `HEoHEIN0`
- `HEpHN8`
- `HEwHEIN8`
- `HExIN0`
- `HH9Upu`
- `HHHhH9`
- `HHHxyOHtH28`
- `HHLuhW`
- `HHMh3I`
- `HHt5LH`
- `HHt5LL`
- `HHtBHb`
- `HHtOLIH`
- `HHt_LH`
- `HHte3Mt`
- `HHugL5g`
- `HIHIPHHt`
- `HIHLXHt`
- `HIPIPPHt`
- `HIaHHt7Hu`
- `HM3HuHt`
- `HMHEIH5`
- `HMLeHt`
- `HMLuHt`
- `HMMLuHt`
- `HMgHMt`
- `HMoILmH`
- `HMw3Ht`
- `HO8DHM`
- `HUHEwLHEI`
- `HUHME3H`
- `HUHuE3LuA`
- `Hp3HxE3LhHLpE3Lx3HE`
- `HuHUHH`
- `HuHUII`
- `HuHUIWg`
- `HugIMt`
- `IFh33L0H0Mt`
- `IFhE33H`
- `IFhL0H0Ht`
- `ILmIMHt`
- `InitializeSListHead`
- `IwjNLB`
- `LHHHHHuc`
- `LHMLuHt`
- `LHuNL5`
- `LLHExHI`
- `LeEwtMu`
- `LeHUHr`
- `LehHN0`
- `LmHUHXx`
- `LmHUIJ`
- `LmIEhH`
- `LmLuHUIFhH`
- `LpE3Iy`

### Cython 符号

- `services.source_1688_third_party_api_service`
- `services.source_1688_third_party_api_service.__pyx_scope_struct_1_genexpr`
- `services.source_1688_third_party_api_service.__pyx_scope_struct___limit_variants_with_preferred`
- `services.source_1688_third_party_api_service._build_attributes_text`
- `services.source_1688_third_party_api_service._build_detail_summary`
- `services.source_1688_third_party_api_service._build_variant_records`
- `services.source_1688_third_party_api_service._extract_color_code`
- `services.source_1688_third_party_api_service._extract_image_url`
- `services.source_1688_third_party_api_service._extract_item_images`
- `services.source_1688_third_party_api_service._extract_offer_id`
- `services.source_1688_third_party_api_service._limit_variants_with_preferred`
- `services.source_1688_third_party_api_service._limit_variants_with_preferred.genexpr`
- `services.source_1688_third_party_api_service._normalize_money`
- `services.source_1688_third_party_api_service._parse_properties_name`
- `services.source_1688_third_party_api_service._persist_onebound_item_get_response`
- `services.source_1688_third_party_api_service._safe_float`
- `services.source_1688_third_party_api_service._safe_int`
- `services.source_1688_third_party_api_service.extract_onebound_1688_seller_id`
- `services.source_1688_third_party_api_service.fetch_1688_detail_data_via_third_party_api`
- `services.source_1688_third_party_api_service.fetch_1688_detail_data_via_third_party_api_safe`
- `services.source_1688_third_party_api_service.fetch_onebound_1688_item_get_payload`

### PyInit 反汇编片段

```asm
0x180013fa0: lea rcx, [rip + 0x12d89]
0x180013fa7: jmp qword ptr [rip + 0xb43a]
0x180013fae: int3
0x180013faf: int3
0x180013fb0: push rsi
0x180013fb2: sub rsp, 0x30
0x180013fb6: mov rsi, rcx
0x180013fb9: call qword ptr [rip + 0xb609]
0x180013fbf: mov rcx, qword ptr [rax + 0x10]
0x180013fc3: call qword ptr [rip + 0xb16f]
0x180013fc9: cmp rax, -1
0x180013fcd: je 0x18001401e
0x180013fcf: mov rdx, qword ptr [rip + 0x12d2a]
0x180013fd6: cmp rdx, -1
0x180013fda: jne 0x180014002
0x180013fdc: mov qword ptr [rip + 0x12d1d], rax
0x180013fe3: mov rax, qword ptr [rip + 0x13a4e]
0x180013fea: test rax, rax
0x180013fed: je 0x180014026
0x180013fef: mov ecx, dword ptr [rax]
0x180013ff1: add ecx, 1
0x180013ff4: je 0x1800140fd
0x180013ffa: mov dword ptr [rax], ecx
0x180013ffc: add rsp, 0x30
0x180014000: pop rsi
0x180014001: ret
0x180014002: cmp rdx, rax
0x180014005: je 0x180013fe3
0x180014007: mov rcx, qword ptr [rip + 0xb462]
0x18001400e: lea rdx, [rip + 0xc07b]
0x180014015: mov rcx, qword ptr [rcx]
0x180014018: call qword ptr [rip + 0xb1ba]
0x18001401e: xor eax, eax
0x180014020: add rsp, 0x30
0x180014024: pop rsi
0x180014025: ret
0x180014026: mov qword ptr [rsp + 0x40], rbx
0x18001402b: lea rdx, [rip + 0xc0be]
0x180014032: mov qword ptr [rsp + 0x48], rbp
0x180014037: mov rcx, rsi
```

## store_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\store_service.cp312-win_amd64.pyd`
- 大小：84480 bytes
- 入口 RVA：`0xf604`
- 导出：`PyInit_store_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 61440 | 61288 | `0x60000020` |
| `.rdata` | 16896 | 16646 | `0x40000040` |
| `.data` | 2048 | 3672 | `0xc0000040` |
| `.pdata` | 2048 | 1764 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 248 | `0x42000040` |

### Imports

- `python312.dll`：`PyObject_SetAttrString`, `PyLong_FromLong`, `PyObject_GC_UnTrack`, `PyObject_Hash`, `PyUnicode_Concat`, `PyDict_GetItemWithError`, `PyInterpreterState_GetID`, `PyObject_GetAttr`, `PyModule_GetName`, `PyObject_HasAttr`, `PyErr_GetRaisedException`, `_Py_NoneStruct`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- ` maozierp_login_service.py `
- `Module 'store_service' has already been imported. Re-initialisation is not supported.`
- `PyInit_store_service`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `api-ms-win-crt-runtime-l1-1-0.dll`
- `init services.store_service`
- `services/store_service.py`
- `services\store_service.c`
- `store_service.cp312-win_amd64.pyd`
- `主动调用内部 API 获取全量数据`
- `参考 maozierp_login_service.py 的风格`
- `已抓取商品SKU`

### 可见函数/变量名

- `AHHLII`
- `C9cFH3`
- `DisableThreadLibraryCalls`
- `E3IHEpHuhLux7`
- `E3LeILuH`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H3EH3H`
- `H3HLXHt`
- `H98tcH`
- `H98tcHA`
- `HE8Lu0`
- `HEE3HE`
- `HEHHhf`
- `HEHuHHt`
- `HELmHHt`
- `HHHxyOHtH28`
- `HHt5LH`
- `HHt5LL`
- `HHt9HP`
- `HHtKHMLH`
- `HHtOLIH`
- `HHt_LH`
- `HHto6H`
- `HIHIPHHt`
- `HIPIPPHt`
- `HMHEIH5`
- `HMILmHt`
- `HO8DHM`
- `HUE3HEA`
- `HUE3HEI`
- `HUE3HuI`
- `HUE3LeLHu`
- `HUHEL5m`
- `HULuE3LeA`
- `HyhwAi`
- `InitializeSListHead`
- `LHHHHHu_`
- `LHuVA9`
- `LUSAWIkH`
- `LUSIhH`
- `LeHUHe`
- `LeLeIK`
- `LmHUHHg`
- `LmHUHg`
- `LuHUHP`
- `LuHUI3Q`
- `QueryPerformanceCounter`
- `SUWAUH`
- `SVWAUAVH`
- `SWAUAVH`
- `SWAUAVHH`
- `Taxhxo`
- `UVWATAUAVAWH`
- `UVWAUAWH`
- `VWATAVAWH`
- `WE3IHA`
- `WHUE3I`
- `__C_specific_handler`
- `__annotations__`
- `__builtins__`
- `__closure__`
- `__code__`
- `__defaults__`
- `__dict__`
- `__doc__`
- `__file__`
- `__globals__`
- `__kwdefaults__`
- `__loader__`
- `__module__`
- `__name__`
- `__package__`
- `__path__`
- `__qualname__`
- `__reduce__`
- `__std_type_info_destroy_list`
- `__vectorcalloffset__`

### Cython 符号

- `services.store_service`
- `services.store_service.analyze_store_filters`
- `services.store_service.extract_ozon_order_count`
- `services.store_service.fetch_full_filter_data`
- `services.store_service.get_driver_path`
- `services.store_service.save_progress_to_local`

### PyInit 反汇编片段

```asm
0x1800097b0: lea rcx, [rip + 0xbe69]
0x1800097b7: jmp qword ptr [rip + 0x6b52]
0x1800097be: int3
0x1800097bf: int3
0x1800097c0: push rsi
0x1800097c2: sub rsp, 0x30
0x1800097c6: mov rsi, rcx
0x1800097c9: call qword ptr [rip + 0x6cf9]
0x1800097cf: mov rcx, qword ptr [rax + 0x10]
0x1800097d3: call qword ptr [rip + 0x690f]
0x1800097d9: cmp rax, -1
0x1800097dd: je 0x18000982e
0x1800097df: mov rdx, qword ptr [rip + 0xbe32]
0x1800097e6: cmp rdx, -1
0x1800097ea: jne 0x180009812
0x1800097ec: mov qword ptr [rip + 0xbe25], rax
0x1800097f3: mov rax, qword ptr [rip + 0xc64e]
0x1800097fa: test rax, rax
0x1800097fd: je 0x180009836
0x1800097ff: mov ecx, dword ptr [rax]
0x180009801: add ecx, 1
0x180009804: je 0x18000990d
0x18000980a: mov dword ptr [rax], ecx
0x18000980c: add rsp, 0x30
0x180009810: pop rsi
0x180009811: ret
0x180009812: cmp rdx, rax
0x180009815: je 0x1800097f3
0x180009817: mov rcx, qword ptr [rip + 0x6b6a]
0x18000981e: lea rdx, [rip + 0x6f4b]
0x180009825: mov rcx, qword ptr [rcx]
0x180009828: call qword ptr [rip + 0x692a]
0x18000982e: xor eax, eax
0x180009830: add rsp, 0x30
0x180009834: pop rsi
0x180009835: ret
0x180009836: mov qword ptr [rsp + 0x40], rbx
0x18000983b: lea rdx, [rip + 0x6f8e]
0x180009842: mov qword ptr [rsp + 0x48], rbp
0x180009847: mov rcx, rsi
```

## user_settings_service.cp312-win_amd64.pyd

- 文件：`E:\ai-test\【有货源】黑左AI\hazel\resources\backend\_internal\services\user_settings_service.cp312-win_amd64.pyd`
- 大小：96768 bytes
- 入口 RVA：`0x11f24`
- 导出：`PyInit_user_settings_service`

### Sections

| 名称 | Raw | Virtual | Characteristics |
|---|---:|---:|---|
| `.text` | 72192 | 71816 | `0x60000020` |
| `.rdata` | 17408 | 17104 | `0x40000040` |
| `.data` | 2560 | 4224 | `0xc0000040` |
| `.pdata` | 2560 | 2112 | `0x40000040` |
| `.rsrc` | 512 | 248 | `0x40000040` |
| `.reloc` | 512 | 300 | `0x42000040` |

### Imports

- `python312.dll`：`PyObject_GC_UnTrack`, `PyObject_Hash`, `PyUnicode_Concat`, `PyDict_GetItemWithError`, `PyInterpreterState_GetID`, `PyObject_GetAttr`, `PyModule_GetName`, `PyDict_Contains`, `PyObject_HasAttr`, `PyErr_GetRaisedException`, `_Py_NoneStruct`, `PyTuple_New`
- `KERNEL32.dll`：`DisableThreadLibraryCalls`, `QueryPerformanceCounter`, `GetCurrentProcessId`, `GetCurrentThreadId`, `GetSystemTimeAsFileTime`, `InitializeSListHead`
- `VCRUNTIME140.dll`：`memcpy`, `strrchr`, `__C_specific_handler`, `memset`, `__std_type_info_destroy_list`, `memcmp`
- `api-ms-win-crt-runtime-l1-1-0.dll`：`_initterm_e`, `_seh_filter_dll`, `_configure_narrow_argv`, `_initialize_narrow_environment`, `_initialize_onexit_table`, `_initterm`, `_execute_onexit_table`, `_cexit`

### 业务关键词字符串

- `    runtime data outside resources/backend lets installers replace the whole`
- `PyObject_Vectorcall`
- `PyObject_VectorcallDict`
- `PyObject_VectorcallMethod`
- `Return the local runtime data directory.\n\n    Desktop builds receive OZON_BACKEND_RUNTIME_DIR from Electron. Keeping\n    runtime data outside resources/backend lets installers replace the whole\n    app directory without having to delete`
- `api-ms-win-crt-runtime-l1-1-0.dll`

### 可见函数/变量名

- `CythonUnboundCMethod`
- `DisableThreadLibraryCalls`
- `E33E38`
- `E33HEHMa`
- `E3E3IL`
- `E3E3Mt`
- `E3HLuA`
- `E3ILuI`
- `E3LuLLeHUHuk`
- `E3MkEEMs`
- `GetCurrentProcessId`
- `GetCurrentThreadId`
- `GetSystemTimeAsFileTime`
- `H0L0Ht`
- `H3EH3H`
- `H98tcH`
- `H98tcHA`
- `HChE3E3H`
- `HEHHEH`
- `HEHHhH`
- `HEHUE3HEA`
- `HEHUPE3HEXA`
- `HHHxyOHtH28`
- `HHt4LL`
- `HHt5LH`
- `HHtOLIH`
- `HHt_LH`
- `HHto6H`
- `HIHIPHHt`
- `HIPIPPHt`
- `HO8DHM`
- `HUHuE3LmA`
- `HULuE3LmA`
- `HUXE3HuXI`
- `HuHUHFhH`
- `IGhHUH`
- `InitializeSListHead`
- `LHuJH57`
- `LUSAWIkH`
- `LmHUHk`
- `MHUMHU`
- `MLmpE3HEx`
- `QueryPerformanceCounter`
- `SUWAUH`
- `SVWAUAVH`
- `UVWATAUAVAWH`
- `VWATAVAWH`
- `VWATAVAWHPH`
- `WHU0E3I`
- `WHUE3I`
- `WHUhE3I`
- `__C_specific_handler`
- `__annotations__`
- `__builtins__`
- `__closure__`
- `__code__`
- `__defaults__`
- `__dict__`
- `__doc__`
- `__file__`
- `__globals__`
- `__kwdefaults__`
- `__loader__`
- `__module__`
- `__name__`
- `__orig_bases__`
- `__package__`
- `__path__`
- `__qualname__`
- `__reduce__`
- `__std_type_info_destroy_list`
- `__vectorcalloffset__`
- `__weaklistoffset__`
- `_blob_to_bytes`
- `_bytes_to_blob`
- `_cexit`
- `_configure_narrow_argv`
- `_cython_3_2_4`
- `_deserialize_settings`
- `_dpapi_available`

### Cython 符号

- `services.user_settings_service`
- `services.user_settings_service._blob_to_bytes`
- `services.user_settings_service._bytes_to_blob`
- `services.user_settings_service._deserialize_settings`
- `services.user_settings_service._dpapi_available`
- `services.user_settings_service._is_dpapi_value`
- `services.user_settings_service._protect_secret_text`
- `services.user_settings_service._serialize_settings`
- `services.user_settings_service._unprotect_secret_text`
- `services.user_settings_service.get_1688_credentials`
- `services.user_settings_service.get_device_identity_path`
- `services.user_settings_service.get_license_key_path`
- `services.user_settings_service.get_maozierp_credentials`
- `services.user_settings_service.get_user_data_dir`
- `services.user_settings_service.get_user_settings_path`
- `services.user_settings_service.load_user_settings`
- `services.user_settings_service.save_1688_credentials`
- `services.user_settings_service.save_maozierp_credentials`
- `services.user_settings_service.save_user_settings`

### PyInit 反汇编片段

```asm
0x18000afd0: lea rcx, [rip + 0xd7a9]
0x18000afd7: jmp qword ptr [rip + 0x830a]
0x18000afde: int3
0x18000afdf: int3
0x18000afe0: push rsi
0x18000afe2: sub rsp, 0x30
0x18000afe6: mov rsi, rcx
0x18000afe9: call qword ptr [rip + 0x84a9]
0x18000afef: mov rcx, qword ptr [rax + 0x10]
0x18000aff3: call qword ptr [rip + 0x80df]
0x18000aff9: cmp rax, -1
0x18000affd: je 0x18000b04e
0x18000afff: mov rdx, qword ptr [rip + 0xd712]
0x18000b006: cmp rdx, -1
0x18000b00a: jne 0x18000b032
0x18000b00c: mov qword ptr [rip + 0xd705], rax
0x18000b013: mov rax, qword ptr [rip + 0xe056]
0x18000b01a: test rax, rax
0x18000b01d: je 0x18000b056
0x18000b01f: mov ecx, dword ptr [rax]
0x18000b021: add ecx, 1
0x18000b024: je 0x18000b12d
0x18000b02a: mov dword ptr [rax], ecx
0x18000b02c: add rsp, 0x30
0x18000b030: pop rsi
0x18000b031: ret
0x18000b032: cmp rdx, rax
0x18000b035: je 0x18000b013
0x18000b037: mov rcx, qword ptr [rip + 0x832a]
0x18000b03e: lea rdx, [rip + 0x8b5b]
0x18000b045: mov rcx, qword ptr [rcx]
0x18000b048: call qword ptr [rip + 0x80fa]
0x18000b04e: xor eax, eax
0x18000b050: add rsp, 0x30
0x18000b054: pop rsi
0x18000b055: ret
0x18000b056: mov qword ptr [rsp + 0x40], rbx
0x18000b05b: lea rdx, [rip + 0x8b9e]
0x18000b062: mov qword ptr [rsp + 0x48], rbp
0x18000b067: mov rcx, rsi
```
