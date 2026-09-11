import { _ as _plugin_vue_export_helper_default, v as vue_exports, s as server_renderer_exports, a as _sfc_main, $ as $fetch$2, j as _sfc_main$5 } from '../virtual/entry.mjs';
import { u as useFetch, A as AppNavbar_default, _ as _sfc_main$2, b as _sfc_main$1, a as _sfc_main$1$2 } from './SelectMenu-DTgPC44F.mjs';
import { u as useDelayedPending, _ as _sfc_main$1$1, h as _sfc_main$3, i as _sfc_main$2$1 } from './Slideover-BaCnZUOs.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'nostics';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'devalue';
import 'tailwindcss/colors';

//#region app/components/kbli/KbliDataPreview.vue?vue&type=script&setup=true&lang.ts
var PREVIEW_LIMIT = 2;
var KbliDataPreview_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "KbliDataPreview",
	__ssrInlineRender: true,
	props: {
		data: {},
		expanded: { type: Boolean }
	},
	emits: ["toggle"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const rows = (0, vue_exports.computed)(() => props.data.split(/\r?\n/).map((line) => {
			const divider = line.indexOf(":");
			if (divider <= 0) return null;
			const key = line.slice(0, divider).trim();
			const value = line.slice(divider + 1).trim();
			if (!key || !value) return null;
			return {
				label: key.replace(/[_-]+/g, " ").replace(/\b\w/g, (character) => character.toUpperCase()),
				value
			};
		}).filter((row) => row !== null));
		const rawLines = (0, vue_exports.computed)(() => props.data.split(/\r?\n/).filter(Boolean));
		const isStructured = (0, vue_exports.computed)(() => rows.value.length > 0);
		const visibleRows = (0, vue_exports.computed)(() => props.expanded ? rows.value : rows.value.slice(0, PREVIEW_LIMIT));
		const visibleRaw = (0, vue_exports.computed)(() => (props.expanded ? rawLines.value : rawLines.value.slice(0, PREVIEW_LIMIT)).join("\n"));
		const hasMore = (0, vue_exports.computed)(() => (isStructured.value ? rows.value.length : rawLines.value.length) > PREVIEW_LIMIT);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "data-preview" }, _attrs))} data-v-2a167c3b>`);
			if ((0, vue_exports.unref)(isStructured)) {
				_push(`<dl data-v-2a167c3b><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(visibleRows), (entry) => {
					_push(`<div data-v-2a167c3b><dt data-v-2a167c3b>${(0, server_renderer_exports.ssrInterpolate)(entry.label)}</dt><dd data-v-2a167c3b>${(0, server_renderer_exports.ssrInterpolate)(entry.value)}</dd></div>`);
				});
				_push(`<!--]--></dl>`);
			} else _push(`<pre class="data-raw" data-v-2a167c3b>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(visibleRaw))}</pre>`);
			if ((0, vue_exports.unref)(hasMore)) _push(`<button type="button" class="data-toggle"${(0, server_renderer_exports.ssrRenderAttr)("aria-expanded", __props.expanded)} data-v-2a167c3b>${(0, server_renderer_exports.ssrInterpolate)(__props.expanded ? "Ringkas" : "Lihat semua")}</button>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/components/kbli/KbliDataPreview.vue
var _sfc_setup$4 = KbliDataPreview_vue_vue_type_script_setup_true_lang_default.setup;
KbliDataPreview_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/kbli/KbliDataPreview.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var KbliDataPreview_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(KbliDataPreview_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-2a167c3b"]]), { __name: "KbliDataPreview" });
//#endregion
//#region app/components/kbli/KbliRow.vue?vue&type=script&setup=true&lang.ts
var KbliRow_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "KbliRow",
	__ssrInlineRender: true,
	props: {
		kbli: {},
		expanded: { type: Boolean },
		saving: { type: Boolean }
	},
	emits: ["toggle-data", "toggle-handling"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$5;
			_push(`<tr${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "kbli-row" }, _attrs))} data-v-ae731f39><td class="kbli-cell kbli-cell--kategori" data-v-ae731f39><span class="kbli-kategori" data-v-ae731f39>${(0, server_renderer_exports.ssrInterpolate)(__props.kbli.kategori)}</span></td><td class="kbli-cell kbli-cell--data" data-v-ae731f39>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(KbliDataPreview_default, {
				data: __props.kbli.data,
				expanded: __props.expanded,
				onToggle: ($event) => emit("toggle-data")
			}, null, _parent));
			_push(`</td><td class="kbli-cell kbli-cell--catatan" data-v-ae731f39>`);
			if (__props.kbli.catatan) _push(`<p class="kbli-note" data-v-ae731f39>${(0, server_renderer_exports.ssrInterpolate)(__props.kbli.catatan)}</p>`);
			else _push(`<span class="kbli-empty" data-v-ae731f39>—</span>`);
			_push(`</td><td class="kbli-cell kbli-cell--status" data-v-ae731f39><span class="${(0, server_renderer_exports.ssrRenderClass)([__props.kbli.isHandled ? "handling-status--done" : "handling-status--pending", "handling-status"])}" data-v-ae731f39>${(0, server_renderer_exports.ssrInterpolate)(__props.kbli.isHandled ? "Selesai (tandai)" : "Belum selesai")}</span></td><td class="kbli-cell kbli-cell--action" data-v-ae731f39><div class="kbli-actions" data-v-ae731f39><button type="button" class="kbli-action"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(__props.saving) ? " disabled" : ""} data-v-ae731f39>`);
			if (__props.saving) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
				name: "i-lucide-loader-circle",
				class: "kbli-action__icon loading-icon",
				"aria-hidden": "true"
			}, null, _parent));
			else _push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
				name: __props.kbli.isHandled ? "i-lucide-undo-2" : "i-lucide-check",
				class: "kbli-action__icon",
				"aria-hidden": "true"
			}, null, _parent));
			_push(` ${(0, server_renderer_exports.ssrInterpolate)(__props.saving ? "Memproses" : __props.kbli.isHandled ? "Batalkan" : "Tandai selesai")}</button></div></td></tr>`);
		};
	}
});
//#endregion
//#region app/components/kbli/KbliRow.vue
var _sfc_setup$3 = KbliRow_vue_vue_type_script_setup_true_lang_default.setup;
KbliRow_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/kbli/KbliRow.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var KbliRow_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(KbliRow_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-ae731f39"]]), { __name: "KbliRow" });
//#endregion
//#region app/components/kbli/KbliAssignmentGroup.vue?vue&type=script&setup=true&lang.ts
var UNASSIGNED_EXECUTOR_VALUE = "__unassigned__";
var KbliAssignmentGroup_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "KbliAssignmentGroup",
	__ssrInlineRender: true,
	props: {
		group: {},
		expanded: { type: Boolean },
		saving: {},
		savingExecutor: { type: Boolean },
		expandedData: {},
		executorOptions: {}
	},
	emits: [
		"toggle-assignment",
		"toggle-data",
		"toggle-handling",
		"update-executor"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const detailsId = (0, vue_exports.computed)(() => `kbli-assignment-${encodeURIComponent(props.group.assignmentId)}`);
		const hasFindings = (0, vue_exports.computed)(() => props.group.kbli.length > 0);
		const executorSelectMenuUi = {
			base: "bg-[var(--color-paper)] text-[var(--color-ink-2)] placeholder:text-[var(--color-muted)] ring-[var(--color-rule-2)] hover:bg-[var(--color-paper-2)] disabled:bg-[var(--color-paper)] disabled:text-[var(--color-muted)] disabled:opacity-100",
			arrow: "fill-[var(--color-paper)] stroke-[var(--color-muted)]",
			content: "bg-[var(--color-paper)] text-[var(--color-ink-2)] ring-[var(--color-rule-2)] shadow-lg",
			item: "text-[var(--color-ink-2)] data-highlighted:not-data-disabled:text-[var(--color-ink)] data-highlighted:not-data-disabled:before:bg-[var(--color-paper-2)]"
		};
		const executorItems = (0, vue_exports.computed)(() => [{
			label: "Belum ditugaskan",
			value: UNASSIGNED_EXECUTOR_VALUE
		}, ...props.executorOptions.filter((executor) => executor.id.trim().length > 0).map((executor) => ({
			label: executor.nama,
			value: executor.id.trim()
		}))]);
		function selectedExecutorValue() {
			return props.group.executor?.id.trim() || UNASSIGNED_EXECUTOR_VALUE;
		}
		function updateExecutor(value) {
			const executorId = String(value ?? "").trim();
			emit("update-executor", executorId === UNASSIGNED_EXECUTOR_VALUE ? null : executorId || null);
		}
		function sourceStatusTone(status) {
			const normalized = status?.trim().toUpperCase() ?? "";
			if (normalized.startsWith("REJECTED")) return "red";
			if (normalized.startsWith("APPROVED") || normalized.startsWith("EDITED")) return "green";
			return "blue";
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$5;
			const _component_UTooltip = _sfc_main$2$1;
			const _component_USelectMenu = _sfc_main$1;
			_push(`<!--[--><tr class="${(0, server_renderer_exports.ssrRenderClass)([{ "assignment-row--expanded": __props.expanded }, "assignment-row"])}" data-v-04585dc1><td class="assignment-cell assignment-cell--toggle" data-v-04585dc1>`);
			if ((0, vue_exports.unref)(hasFindings)) {
				_push(`<button type="button" class="assignment-toggle"${(0, server_renderer_exports.ssrRenderAttr)("aria-controls", (0, vue_exports.unref)(detailsId))}${(0, server_renderer_exports.ssrRenderAttr)("aria-expanded", __props.expanded)}${(0, server_renderer_exports.ssrRenderAttr)("aria-label", __props.expanded ? `Tutup detail ${__props.group.assignmentId}` : `Buka detail ${__props.group.assignmentId}`)} data-v-04585dc1>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: __props.expanded ? "i-lucide-chevron-down" : "i-lucide-chevron-right",
					"aria-hidden": "true"
				}, null, _parent));
				_push(`</button>`);
			} else _push(`<!---->`);
			_push(`</td><td class="assignment-cell" data-v-04585dc1><span class="cell-primary" data-v-04585dc1>${(0, server_renderer_exports.ssrInterpolate)(__props.group.wilayah.namaSls || "—")}</span><span class="cell-secondary" data-v-04585dc1>${(0, server_renderer_exports.ssrInterpolate)(__props.group.wilayah.idSubsls)}</span></td><td class="assignment-cell" data-v-04585dc1><span class="cell-primary" data-v-04585dc1>${(0, server_renderer_exports.ssrInterpolate)(__props.group.wilayah.kecamatan || "—")}</span><span class="cell-secondary" data-v-04585dc1>${(0, server_renderer_exports.ssrInterpolate)(__props.group.wilayah.desa || "—")}</span></td><td class="assignment-cell" data-v-04585dc1><span class="cell-primary assignment-name" data-v-04585dc1>${(0, server_renderer_exports.ssrInterpolate)(__props.group.namaAssignment || "Tanpa nama assignment")}</span><span class="cell-secondary assignment-id" data-v-04585dc1>${(0, server_renderer_exports.ssrInterpolate)(__props.group.assignmentId)}</span></td><td class="assignment-cell" data-v-04585dc1><span class="${(0, server_renderer_exports.ssrRenderClass)([`source-status--${sourceStatusTone(__props.group.statusAlias)}`, "source-status"])}" data-v-04585dc1>${(0, server_renderer_exports.ssrInterpolate)(__props.group.statusAlias || "Status FASIH tidak tersedia")}</span><span class="cell-secondary" data-v-04585dc1>No. Bang: ${(0, server_renderer_exports.ssrInterpolate)(__props.group.nomorBangunan || "—")} · SBR: ${(0, server_renderer_exports.ssrInterpolate)(__props.group.idsbr || "—")}</span></td><td class="assignment-cell assignment-cell--fasih" data-v-04585dc1>`);
			if (__props.group.linkFasihEdit) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UTooltip, { text: "Buka di FASIH" }, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<a${(0, server_renderer_exports.ssrRenderAttr)("href", __props.group.linkFasihEdit)} target="_blank" rel="noopener noreferrer" class="assignment-fasih-link"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", `Buka assignment ${__props.group.assignmentId} di FASIH`)} data-v-04585dc1${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
							name: "i-lucide-external-link",
							"aria-hidden": "true"
						}, null, _parent, _scopeId));
						_push(`</a>`);
					} else return [(0, vue_exports.createVNode)("a", {
						href: __props.group.linkFasihEdit,
						target: "_blank",
						rel: "noopener noreferrer",
						class: "assignment-fasih-link",
						"aria-label": `Buka assignment ${__props.group.assignmentId} di FASIH`
					}, [(0, vue_exports.createVNode)(_component_UIcon, {
						name: "i-lucide-external-link",
						"aria-hidden": "true"
					})], 8, ["href", "aria-label"])];
				}),
				_: 1
			}, _parent));
			else _push(`<span class="cell-secondary" data-v-04585dc1>—</span>`);
			_push(`</td><td class="assignment-cell assignment-cell--executor" data-v-04585dc1>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
				"model-value": selectedExecutorValue(),
				items: (0, vue_exports.unref)(executorItems),
				"value-key": "value",
				color: "neutral",
				variant: "outline",
				size: "sm",
				class: "assignment-executor",
				ui: executorSelectMenuUi,
				disabled: __props.savingExecutor,
				placeholder: "Pilih eksekutor",
				"onUpdate:modelValue": updateExecutor
			}, null, _parent));
			_push(`</td><td class="assignment-cell assignment-cell--handling" data-v-04585dc1><span class="handling-progress"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", `${__props.group.summary.handled} dari ${__props.group.summary.total} KBLI selesai`)} data-v-04585dc1>${(0, server_renderer_exports.ssrInterpolate)(__props.group.summary.handled)}/${(0, server_renderer_exports.ssrInterpolate)(__props.group.summary.total)} selesai </span></td></tr>`);
			if (__props.expanded) {
				_push(`<tr class="assignment-detail-row" data-v-04585dc1><td${(0, server_renderer_exports.ssrRenderAttr)("colspan", 8)} class="assignment-detail-cell" data-v-04585dc1><div${(0, server_renderer_exports.ssrRenderAttr)("id", (0, vue_exports.unref)(detailsId))} class="assignment-detail" data-v-04585dc1><table class="kbli-table" data-v-04585dc1><thead data-v-04585dc1><tr data-v-04585dc1><th scope="col" class="kbli-table__kategori" data-v-04585dc1> Kategori </th><th scope="col" class="kbli-table__data" data-v-04585dc1> Data </th><th scope="col" class="kbli-table__catatan" data-v-04585dc1> Catatan </th><th scope="col" class="kbli-table__status" data-v-04585dc1> Status </th><th scope="col" class="kbli-table__action" data-v-04585dc1> Aksi </th></tr></thead><tbody data-v-04585dc1><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(__props.group.kbli, (finding) => {
					_push((0, server_renderer_exports.ssrRenderComponent)(KbliRow_default, {
						key: finding.id,
						kbli: finding,
						expanded: Boolean(__props.expandedData[finding.id]),
						saving: Boolean(__props.saving[finding.id]),
						onToggleData: ($event) => emit("toggle-data", finding.id),
						onToggleHandling: ($event) => emit("toggle-handling", finding)
					}, null, _parent));
				});
				_push(`<!--]--></tbody></table></div></td></tr>`);
			} else _push(`<!---->`);
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region app/components/kbli/KbliAssignmentGroup.vue
var _sfc_setup$2 = KbliAssignmentGroup_vue_vue_type_script_setup_true_lang_default.setup;
KbliAssignmentGroup_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/kbli/KbliAssignmentGroup.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var KbliAssignmentGroup_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(KbliAssignmentGroup_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-04585dc1"]]), { __name: "KbliAssignmentGroup" });
//#endregion
//#region app/components/kbli/KbliFilterBar.vue?vue&type=script&setup=true&lang.ts
var ALL_VALUE = "__all__";
var KbliFilterBar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "KbliFilterBar",
	__ssrInlineRender: true,
	props: {
		filters: {},
		search: {},
		totalAssignments: {}
	},
	emits: ["update:filters", "update:search"],
	async setup(__props, { emit: __emit }) {
		let __temp, __restore;
		const lightSelectMenuUi = {
			base: "bg-[var(--color-paper)] text-[var(--color-ink-2)] ring-[var(--color-rule-2)] hover:bg-[var(--color-paper-2)] disabled:bg-[var(--color-paper-3)] disabled:text-[var(--color-muted)] disabled:ring-[var(--color-rule-2)] disabled:opacity-100",
			trailingIcon: "text-[var(--color-muted)]",
			content: "w-max max-w-[calc(100vw-1rem)] bg-[var(--color-paper)] text-[var(--color-ink-2)] ring-[var(--color-rule-2)] shadow-lg",
			input: "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink-2)]",
			item: "text-[var(--color-ink-2)] data-highlighted:not-data-disabled:text-[var(--color-ink)] data-highlighted:not-data-disabled:before:bg-[var(--color-paper-2)]",
			itemLabel: "whitespace-normal break-words",
			itemDescription: "text-[var(--color-muted)]"
		};
		const lightInputUi = {
			base: "bg-[var(--color-paper)] text-[var(--color-ink-2)] placeholder:text-[var(--color-muted)] ring-[var(--color-rule-2)]",
			leadingIcon: "text-[var(--color-muted)]"
		};
		const props = __props;
		const emit = __emit;
		const drawerOpen = (0, vue_exports.ref)(false);
		const draftRegionFilters = (0, vue_exports.reactive)({
			kecamatan: "",
			desa: "",
			namaSls: "",
			ppl: "",
			pml: ""
		});
		const regionOptionsQuery = (0, vue_exports.computed)(() => ({
			kecamatan: draftRegionFilters.kecamatan || void 0,
			desa: draftRegionFilters.desa || void 0,
			namaSls: draftRegionFilters.namaSls || void 0,
			ppl: draftRegionFilters.ppl || void 0,
			pml: draftRegionFilters.pml || void 0
		}));
		const { data: regionOptions, status: regionOptionsStatus } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useFetch("/api/kbli/filter-options", { query: regionOptionsQuery }, "$sQLZc9_fdY")), __temp = await __temp, __restore(), __temp);
		const handlingOptions = [
			{
				label: "Semua status",
				value: ALL_VALUE
			},
			{
				label: "Belum selesai",
				value: "unhandled"
			},
			{
				label: "Selesai (tandai)",
				value: "handled"
			}
		];
		const kategoriOptions = (0, vue_exports.computed)(() => [{
			label: "Semua kategori",
			value: ALL_VALUE
		}, ...(regionOptions.value?.kategori ?? []).map((item) => ({
			label: item.deskripsi ? `${item.kode.trim()} — ${item.deskripsi}` : item.kode.trim(),
			value: item.kode.trim()
		})).filter((item) => item.value.length > 0)]);
		const kecamatanOptions = (0, vue_exports.computed)(() => selectItems(regionOptions.value?.kecamatan, "Semua kecamatan"));
		const desaOptions = (0, vue_exports.computed)(() => selectItems(regionOptions.value?.desa, "Semua desa"));
		const slsOptions = (0, vue_exports.computed)(() => selectItems(regionOptions.value?.namaSls, "Semua SLS"));
		const pplOptions = (0, vue_exports.computed)(() => selectItems(regionOptions.value?.ppl, "Semua PPL"));
		const pmlOptions = (0, vue_exports.computed)(() => selectItems(regionOptions.value?.pml, "Semua PML"));
		const selectedHandlingLabel = (0, vue_exports.computed)(() => handlingOptions.find((option) => option.value === toSelectValue(props.filters.completionStatus))?.label ?? "Status penanganan");
		const activeRegionFilterCount = (0, vue_exports.computed)(() => Object.values({
			kecamatan: props.filters.kecamatan,
			desa: props.filters.desa,
			namaSls: props.filters.namaSls,
			ppl: props.filters.ppl,
			pml: props.filters.pml
		}).filter(Boolean).length);
		const isRegionOptionsLoading = (0, vue_exports.computed)(() => regionOptionsStatus.value === "pending");
		(0, vue_exports.watch)(drawerOpen, (isOpen) => {
			if (isOpen) syncDraftRegionFilters();
		});
		function selectItems(values, allLabel) {
			return [{
				label: allLabel,
				value: ALL_VALUE
			}, ...(values ?? []).map((value) => value.trim()).filter((value) => value.length > 0).map((value) => ({
				label: value,
				value
			}))];
		}
		function toSelectValue(value) {
			return value.trim().length > 0 ? value : ALL_VALUE;
		}
		function fromSelectValue(value) {
			return typeof value === "string" && value !== ALL_VALUE ? value : "";
		}
		function syncDraftRegionFilters() {
			Object.assign(draftRegionFilters, {
				kecamatan: props.filters.kecamatan,
				desa: props.filters.desa,
				namaSls: props.filters.namaSls,
				ppl: props.filters.ppl,
				pml: props.filters.pml
			});
		}
		function updateSearch(value) {
			emit("update:search", typeof value === "string" ? value : "");
		}
		function updateQuickFilter(field, value) {
			emit("update:filters", {
				...props.filters,
				[field]: fromSelectValue(value)
			});
		}
		function updateDraftRegionFilter(field, value) {
			draftRegionFilters[field] = fromSelectValue(value);
			if (field === "kecamatan") {
				draftRegionFilters.desa = "";
				draftRegionFilters.namaSls = "";
			}
			if (field === "desa") draftRegionFilters.namaSls = "";
		}
		function resetRegionFilters() {
			Object.assign(draftRegionFilters, {
				kecamatan: "",
				desa: "",
				namaSls: "",
				ppl: "",
				pml: ""
			});
		}
		function applyRegionFilters() {
			emit("update:filters", {
				...props.filters,
				...draftRegionFilters
			});
			drawerOpen.value = false;
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_USelectMenu = _sfc_main$1;
			const _component_UBadge = _sfc_main$1$1;
			const _component_UInput = _sfc_main$1$2;
			const _component_USlideover = _sfc_main$3;
			const _component_UButton = _sfc_main;
			_push(`<section${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({
				class: "filter-toolbar",
				"aria-label": "Filter KBLI"
			}, _attrs))} data-v-48d97f4a><div class="filter-toolbar__summary" data-v-48d97f4a>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
				"model-value": toSelectValue(__props.filters.completionStatus),
				items: handlingOptions,
				"value-key": "value",
				color: "neutral",
				variant: "outline",
				size: "md",
				class: "filter-toolbar__status-select",
				ui: lightSelectMenuUi,
				"search-input": false,
				placeholder: "Pilih status",
				"aria-label": "Status Penanganan",
				"onUpdate:modelValue": ($event) => updateQuickFilter("completionStatus", String($event ?? ""))
			}, null, _parent));
			_push(`<div class="filter-toolbar__total" aria-live="polite" data-v-48d97f4a>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
				color: "warning",
				variant: "solid",
				size: "sm"
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(__props.totalAssignments)}`);
					else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.totalAssignments), 1)];
				}),
				_: 1
			}, _parent));
			_push(`<span data-v-48d97f4a>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(selectedHandlingLabel))}</span></div></div><div class="filter-toolbar__controls" data-v-48d97f4a>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
				"model-value": __props.search,
				class: "filter-toolbar__search",
				color: "neutral",
				variant: "outline",
				size: "md",
				icon: "i-lucide-search",
				ui: lightInputUi,
				type: "search",
				placeholder: "Cari assignment, nama, SLS, wilayah, bangunan...",
				"onUpdate:modelValue": updateSearch
			}, null, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
				"model-value": toSelectValue(__props.filters.kategori),
				items: (0, vue_exports.unref)(kategoriOptions),
				"value-key": "value",
				color: "neutral",
				variant: "outline",
				size: "md",
				class: "filter-toolbar__kategori",
				ui: lightSelectMenuUi,
				"search-input": {
					autofocus: false,
					icon: "i-lucide-search",
					placeholder: "Cari kategori..."
				},
				loading: (0, vue_exports.unref)(isRegionOptionsLoading),
				"aria-label": "Kategori temuan KBLI",
				"onUpdate:modelValue": ($event) => updateQuickFilter("kategori", String($event ?? ""))
			}, null, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_USlideover, {
				open: (0, vue_exports.unref)(drawerOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(drawerOpen) ? drawerOpen.value = $event : null,
				title: "Filter Wilayah",
				ui: {
					content: "w-full max-w-md bg-[var(--color-paper)] text-[var(--color-ink-2)]",
					header: "border-b border-[var(--color-rule)] bg-[var(--color-paper)] px-4 py-3 text-[var(--color-ink)]",
					body: "bg-[var(--color-paper)] p-0",
					footer: "bg-[var(--color-paper)] p-0"
				}
			}, {
				body: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="region-drawer" data-v-48d97f4a${_scopeId}><label class="region-drawer__field" data-v-48d97f4a${_scopeId}><span data-v-48d97f4a${_scopeId}>Kecamatan</span>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
							"model-value": toSelectValue((0, vue_exports.unref)(draftRegionFilters).kecamatan),
							items: (0, vue_exports.unref)(kecamatanOptions),
							"value-key": "value",
							color: "neutral",
							variant: "outline",
							size: "md",
							ui: lightSelectMenuUi,
							"search-input": {
								autofocus: false,
								placeholder: "Cari kecamatan..."
							},
							loading: (0, vue_exports.unref)(isRegionOptionsLoading),
							"onUpdate:modelValue": ($event) => updateDraftRegionFilter("kecamatan", String($event ?? ""))
						}, null, _parent, _scopeId));
						_push(`</label><label class="region-drawer__field" data-v-48d97f4a${_scopeId}><span data-v-48d97f4a${_scopeId}>Desa</span>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
							"model-value": toSelectValue((0, vue_exports.unref)(draftRegionFilters).desa),
							items: (0, vue_exports.unref)(desaOptions),
							"value-key": "value",
							color: "neutral",
							variant: "outline",
							size: "md",
							ui: lightSelectMenuUi,
							disabled: !(0, vue_exports.unref)(draftRegionFilters).kecamatan,
							"search-input": {
								autofocus: false,
								placeholder: "Cari desa..."
							},
							loading: (0, vue_exports.unref)(isRegionOptionsLoading),
							"onUpdate:modelValue": ($event) => updateDraftRegionFilter("desa", String($event ?? ""))
						}, null, _parent, _scopeId));
						_push(`</label><label class="region-drawer__field" data-v-48d97f4a${_scopeId}><span data-v-48d97f4a${_scopeId}>SLS</span>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
							"model-value": toSelectValue((0, vue_exports.unref)(draftRegionFilters).namaSls),
							items: (0, vue_exports.unref)(slsOptions),
							"value-key": "value",
							color: "neutral",
							variant: "outline",
							size: "md",
							ui: lightSelectMenuUi,
							disabled: !(0, vue_exports.unref)(draftRegionFilters).desa,
							"search-input": {
								autofocus: false,
								placeholder: "Cari SLS..."
							},
							loading: (0, vue_exports.unref)(isRegionOptionsLoading),
							"onUpdate:modelValue": ($event) => updateDraftRegionFilter("namaSls", String($event ?? ""))
						}, null, _parent, _scopeId));
						_push(`</label><label class="region-drawer__field" data-v-48d97f4a${_scopeId}><span data-v-48d97f4a${_scopeId}>PML</span>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
							"model-value": toSelectValue((0, vue_exports.unref)(draftRegionFilters).pml),
							items: (0, vue_exports.unref)(pmlOptions),
							"value-key": "value",
							color: "neutral",
							variant: "outline",
							size: "md",
							ui: lightSelectMenuUi,
							"search-input": {
								autofocus: false,
								placeholder: "Cari PML..."
							},
							loading: (0, vue_exports.unref)(isRegionOptionsLoading),
							"onUpdate:modelValue": ($event) => updateDraftRegionFilter("pml", String($event ?? ""))
						}, null, _parent, _scopeId));
						_push(`</label><label class="region-drawer__field" data-v-48d97f4a${_scopeId}><span data-v-48d97f4a${_scopeId}>PPL</span>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
							"model-value": toSelectValue((0, vue_exports.unref)(draftRegionFilters).ppl),
							items: (0, vue_exports.unref)(pplOptions),
							"value-key": "value",
							color: "neutral",
							variant: "outline",
							size: "md",
							ui: lightSelectMenuUi,
							"search-input": {
								autofocus: false,
								placeholder: "Cari PPL..."
							},
							loading: (0, vue_exports.unref)(isRegionOptionsLoading),
							"onUpdate:modelValue": ($event) => updateDraftRegionFilter("ppl", String($event ?? ""))
						}, null, _parent, _scopeId));
						_push(`</label></div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "region-drawer" }, [
						(0, vue_exports.createVNode)("label", { class: "region-drawer__field" }, [(0, vue_exports.createVNode)("span", null, "Kecamatan"), (0, vue_exports.createVNode)(_component_USelectMenu, {
							"model-value": toSelectValue((0, vue_exports.unref)(draftRegionFilters).kecamatan),
							items: (0, vue_exports.unref)(kecamatanOptions),
							"value-key": "value",
							color: "neutral",
							variant: "outline",
							size: "md",
							ui: lightSelectMenuUi,
							"search-input": {
								autofocus: false,
								placeholder: "Cari kecamatan..."
							},
							loading: (0, vue_exports.unref)(isRegionOptionsLoading),
							"onUpdate:modelValue": ($event) => updateDraftRegionFilter("kecamatan", String($event ?? ""))
						}, null, 8, [
							"model-value",
							"items",
							"loading",
							"onUpdate:modelValue"
						])]),
						(0, vue_exports.createVNode)("label", { class: "region-drawer__field" }, [(0, vue_exports.createVNode)("span", null, "Desa"), (0, vue_exports.createVNode)(_component_USelectMenu, {
							"model-value": toSelectValue((0, vue_exports.unref)(draftRegionFilters).desa),
							items: (0, vue_exports.unref)(desaOptions),
							"value-key": "value",
							color: "neutral",
							variant: "outline",
							size: "md",
							ui: lightSelectMenuUi,
							disabled: !(0, vue_exports.unref)(draftRegionFilters).kecamatan,
							"search-input": {
								autofocus: false,
								placeholder: "Cari desa..."
							},
							loading: (0, vue_exports.unref)(isRegionOptionsLoading),
							"onUpdate:modelValue": ($event) => updateDraftRegionFilter("desa", String($event ?? ""))
						}, null, 8, [
							"model-value",
							"items",
							"disabled",
							"loading",
							"onUpdate:modelValue"
						])]),
						(0, vue_exports.createVNode)("label", { class: "region-drawer__field" }, [(0, vue_exports.createVNode)("span", null, "SLS"), (0, vue_exports.createVNode)(_component_USelectMenu, {
							"model-value": toSelectValue((0, vue_exports.unref)(draftRegionFilters).namaSls),
							items: (0, vue_exports.unref)(slsOptions),
							"value-key": "value",
							color: "neutral",
							variant: "outline",
							size: "md",
							ui: lightSelectMenuUi,
							disabled: !(0, vue_exports.unref)(draftRegionFilters).desa,
							"search-input": {
								autofocus: false,
								placeholder: "Cari SLS..."
							},
							loading: (0, vue_exports.unref)(isRegionOptionsLoading),
							"onUpdate:modelValue": ($event) => updateDraftRegionFilter("namaSls", String($event ?? ""))
						}, null, 8, [
							"model-value",
							"items",
							"disabled",
							"loading",
							"onUpdate:modelValue"
						])]),
						(0, vue_exports.createVNode)("label", { class: "region-drawer__field" }, [(0, vue_exports.createVNode)("span", null, "PML"), (0, vue_exports.createVNode)(_component_USelectMenu, {
							"model-value": toSelectValue((0, vue_exports.unref)(draftRegionFilters).pml),
							items: (0, vue_exports.unref)(pmlOptions),
							"value-key": "value",
							color: "neutral",
							variant: "outline",
							size: "md",
							ui: lightSelectMenuUi,
							"search-input": {
								autofocus: false,
								placeholder: "Cari PML..."
							},
							loading: (0, vue_exports.unref)(isRegionOptionsLoading),
							"onUpdate:modelValue": ($event) => updateDraftRegionFilter("pml", String($event ?? ""))
						}, null, 8, [
							"model-value",
							"items",
							"loading",
							"onUpdate:modelValue"
						])]),
						(0, vue_exports.createVNode)("label", { class: "region-drawer__field" }, [(0, vue_exports.createVNode)("span", null, "PPL"), (0, vue_exports.createVNode)(_component_USelectMenu, {
							"model-value": toSelectValue((0, vue_exports.unref)(draftRegionFilters).ppl),
							items: (0, vue_exports.unref)(pplOptions),
							"value-key": "value",
							color: "neutral",
							variant: "outline",
							size: "md",
							ui: lightSelectMenuUi,
							"search-input": {
								autofocus: false,
								placeholder: "Cari PPL..."
							},
							loading: (0, vue_exports.unref)(isRegionOptionsLoading),
							"onUpdate:modelValue": ($event) => updateDraftRegionFilter("ppl", String($event ?? ""))
						}, null, 8, [
							"model-value",
							"items",
							"loading",
							"onUpdate:modelValue"
						])])
					])];
				}),
				footer: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="region-drawer__actions" data-v-48d97f4a${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
							label: "Reset",
							color: "error",
							size: "md",
							onClick: resetRegionFilters
						}, null, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
							label: "Terapkan",
							color: "primary",
							size: "md",
							onClick: applyRegionFilters
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "region-drawer__actions" }, [(0, vue_exports.createVNode)(_component_UButton, {
						label: "Reset",
						color: "error",
						size: "md",
						onClick: resetRegionFilters
					}), (0, vue_exports.createVNode)(_component_UButton, {
						label: "Terapkan",
						color: "primary",
						size: "md",
						onClick: applyRegionFilters
					})])];
				}),
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
						color: "neutral",
						variant: "outline",
						size: "md",
						icon: "i-lucide-list-filter",
						class: "filter-toolbar__region-trigger",
						"aria-label": `Filter Wilayah${(0, vue_exports.unref)(activeRegionFilterCount) ? `, ${(0, vue_exports.unref)(activeRegionFilterCount)} filter aktif` : ""}`
					}, {
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<span data-v-48d97f4a${_scopeId}>Filter Wilayah</span>`);
								if ((0, vue_exports.unref)(activeRegionFilterCount)) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
									color: "neutral",
									variant: "solid",
									size: "sm"
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(activeRegionFilterCount))}`);
										else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(activeRegionFilterCount)), 1)];
									}),
									_: 1
								}, _parent, _scopeId));
								else _push(`<!---->`);
							} else return [(0, vue_exports.createVNode)("span", null, "Filter Wilayah"), (0, vue_exports.unref)(activeRegionFilterCount) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UBadge, {
								key: 0,
								color: "neutral",
								variant: "solid",
								size: "sm"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(activeRegionFilterCount)), 1)]),
								_: 1
							})) : (0, vue_exports.createCommentVNode)("", true)];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UButton, {
						color: "neutral",
						variant: "outline",
						size: "md",
						icon: "i-lucide-list-filter",
						class: "filter-toolbar__region-trigger",
						"aria-label": `Filter Wilayah${(0, vue_exports.unref)(activeRegionFilterCount) ? `, ${(0, vue_exports.unref)(activeRegionFilterCount)} filter aktif` : ""}`
					}, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("span", null, "Filter Wilayah"), (0, vue_exports.unref)(activeRegionFilterCount) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UBadge, {
							key: 0,
							color: "neutral",
							variant: "solid",
							size: "sm"
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(activeRegionFilterCount)), 1)]),
							_: 1
						})) : (0, vue_exports.createCommentVNode)("", true)]),
						_: 1
					}, 8, ["aria-label"])];
				}),
				_: 1
			}, _parent));
			_push(`</div></section>`);
		};
	}
});
//#endregion
//#region app/components/kbli/KbliFilterBar.vue
var _sfc_setup$1 = KbliFilterBar_vue_vue_type_script_setup_true_lang_default.setup;
KbliFilterBar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/kbli/KbliFilterBar.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var KbliFilterBar_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(KbliFilterBar_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-48d97f4a"]]), { __name: "KbliFilterBar" });
//#endregion
//#region app/pages/kbli.vue?vue&type=script&setup=true&lang.ts
var PAGE_SIZE = 20;
var kbli_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "kbli",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const filters = (0, vue_exports.reactive)({
			kecamatan: "",
			desa: "",
			namaSls: "",
			ppl: "",
			pml: "",
			kategori: "",
			completionStatus: "unhandled"
		});
		const searchInput = (0, vue_exports.ref)("");
		const committedSearch = (0, vue_exports.ref)("");
		const page = (0, vue_exports.ref)(1);
		const expandedData = (0, vue_exports.reactive)({});
		const expandedAssignments = (0, vue_exports.reactive)({});
		const saving = (0, vue_exports.reactive)({});
		const executorSaving = (0, vue_exports.reactive)({});
		const mutationError = (0, vue_exports.ref)("");
		const listQuery = (0, vue_exports.computed)(() => ({
			page: page.value,
			pageSize: PAGE_SIZE,
			search: committedSearch.value || void 0,
			kecamatan: filters.kecamatan || void 0,
			desa: filters.desa || void 0,
			namaSls: filters.namaSls || void 0,
			ppl: filters.ppl || void 0,
			pml: filters.pml || void 0,
			kategori: filters.kategori || void 0,
			completionStatus: filters.completionStatus || void 0
		}));
		const statisticsQuery = (0, vue_exports.computed)(() => ({
			search: committedSearch.value || void 0,
			kecamatan: filters.kecamatan || void 0,
			desa: filters.desa || void 0,
			namaSls: filters.namaSls || void 0,
			ppl: filters.ppl || void 0,
			pml: filters.pml || void 0,
			kategori: filters.kategori || void 0
		}));
		const { data: list, status: listStatus, error: listError } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useFetch("/api/kbli", { query: listQuery }, "$KbFyF3Vs8Q")), __temp = await __temp, __restore(), __temp);
		const { data: statistics, status: statisticsStatus } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useFetch("/api/kbli/statistics", { query: statisticsQuery }, "$p9VpECtCkY")), __temp = await __temp, __restore(), __temp);
		const { data: executors } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useFetch("/api/kbli/executors", "$XGr8otGLNb")), __temp = await __temp, __restore(), __temp);
		const statisticsCards = (0, vue_exports.computed)(() => [
			{
				assignmentLabel: "Total Assignment",
				findingLabel: "Total KBLI",
				assignments: statistics.value?.total.assignments ?? 0,
				findings: statistics.value?.total.findings ?? 0,
				completionStatus: ""
			},
			{
				assignmentLabel: "Belum Selesai",
				findingLabel: "Belum Selesai",
				assignments: statistics.value?.unhandled.assignments ?? 0,
				findings: statistics.value?.unhandled.findings ?? 0,
				completionStatus: "unhandled"
			},
			{
				assignmentLabel: "Selesai (Tandai)",
				findingLabel: "Selesai (Tandai)",
				assignments: statistics.value?.handled.assignments ?? 0,
				findings: statistics.value?.handled.findings ?? 0,
				completionStatus: "handled"
			}
		]);
		const isLoading = (0, vue_exports.computed)(() => listStatus.value === "pending");
		const isListSkeletonVisible = useDelayedPending(() => isLoading.value);
		const isStatisticsSkeletonVisible = useDelayedPending(() => statisticsStatus.value === "pending");
		const hasGroups = (0, vue_exports.computed)(() => (list.value?.groups.length ?? 0) > 0);
		const rangeStart = (0, vue_exports.computed)(() => {
			if (!list.value || list.value.totalAssignments === 0) return 0;
			return (list.value.page - 1) * list.value.pageSize + 1;
		});
		const rangeEnd = (0, vue_exports.computed)(() => {
			if (!list.value) return 0;
			return Math.min(list.value.page * list.value.pageSize, list.value.totalAssignments);
		});
		let searchTimer;
		(0, vue_exports.watch)(searchInput, (value) => {
			if (searchTimer) clearTimeout(searchTimer);
			searchTimer = setTimeout(() => {
				committedSearch.value = value.trim();
				page.value = 1;
			}, 280);
		});
		(0, vue_exports.watch)([
			() => filters.kecamatan,
			() => filters.desa,
			() => filters.namaSls,
			() => filters.ppl,
			() => filters.pml,
			() => filters.kategori,
			() => filters.completionStatus
		], () => {
			page.value = 1;
		});
		function updateFilters(nextFilters) {
			Object.assign(filters, nextFilters);
		}
		function selectCompletionStatus(completionStatus) {
			updateFilters({
				...filters,
				completionStatus
			});
		}
		function toggleData(id) {
			expandedData[id] = !expandedData[id];
		}
		function toggleAssignment(assignmentId) {
			expandedAssignments[assignmentId] = !expandedAssignments[assignmentId];
		}
		function formatCount(value) {
			return new Intl.NumberFormat("id-ID").format(value);
		}
		function recalculateGroupSummary(group) {
			const unhandled = group.kbli.filter((finding) => !finding.isHandled).length;
			group.summary.total = group.kbli.length;
			group.summary.unhandled = unhandled;
			group.summary.handled = group.summary.total - unhandled;
		}
		async function toggleHandling(group, finding) {
			if (saving[finding.id]) return;
			mutationError.value = "";
			saving[finding.id] = true;
			const previous = {
				isHandled: finding.isHandled,
				handledAt: finding.handledAt,
				summary: { ...group.summary }
			};
			const nextIsHandled = !finding.isHandled;
			finding.isHandled = nextIsHandled;
			finding.handledAt = nextIsHandled ? (/* @__PURE__ */ new Date()).toISOString() : null;
			recalculateGroupSummary(group);
			try {
				const result = await $fetch$2(`/api/kbli/${finding.id}/handling`, {
					method: "PATCH",
					body: { isHandled: nextIsHandled }
				});
				finding.isHandled = result.isHandled;
				finding.handledAt = result.handledAt;
			} catch {
				finding.isHandled = previous.isHandled;
				finding.handledAt = previous.handledAt;
				Object.assign(group.summary, previous.summary);
				mutationError.value = "Status penanganan gagal diperbarui. Perubahan lokal dikembalikan.";
			} finally {
				saving[finding.id] = false;
			}
		}
		async function updateAssignmentExecutor(group, eksekutorId) {
			if (executorSaving[group.assignmentId]) return;
			mutationError.value = "";
			executorSaving[group.assignmentId] = true;
			const previous = group.executor;
			group.executor = eksekutorId ? executors.value?.find((executor) => executor.id === eksekutorId) ?? null : null;
			try {
				group.executor = (await $fetch$2(`/api/kbli/assignment/${encodeURIComponent(group.assignmentId)}/executor`, {
					method: "PATCH",
					body: { eksekutorId }
				})).eksekutor;
			} catch {
				group.executor = previous;
				mutationError.value = "Eksekutor assignment gagal diperbarui. Coba lagi.";
			} finally {
				executorSaving[group.assignmentId] = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AppNavbar = AppNavbar_default;
			const _component_UButton = _sfc_main;
			const _component_USkeleton = _sfc_main$2;
			_push(`<main${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "kbli-page" }, _attrs))} data-v-693f536c>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_AppNavbar, null, null, _parent));
			_push(`<section class="page-heading" aria-labelledby="page-title" data-v-693f536c><div data-v-693f536c><h1 id="page-title" data-v-693f536c> Penelusuran KBLI </h1><p class="page-heading__description" data-v-693f536c> Satu baris untuk satu assignment. Buka detail untuk meninjau dan menangani seluruh temuan KBLI. </p></div></section><section class="statistics-row" aria-label="Statistik assignment KBLI" data-v-693f536c><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(statisticsCards), (card) => {
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					key: card.assignmentLabel,
					color: "neutral",
					variant: "outline",
					class: ["statistics-card", { "statistics-card--active": (0, vue_exports.unref)(filters).completionStatus === card.completionStatus }],
					"aria-pressed": (0, vue_exports.unref)(filters).completionStatus === card.completionStatus,
					onClick: ($event) => selectCompletionStatus(card.completionStatus)
				}, {
					default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<span class="statistics-card__metric" data-v-693f536c${_scopeId}><span class="statistics-card__context" data-v-693f536c${_scopeId}>Assignment</span><span class="statistics-card__label" data-v-693f536c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(card.assignmentLabel)}</span>`);
							if ((0, vue_exports.unref)(isStatisticsSkeletonVisible)) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "statistics-card__value-skeleton" }, null, _parent, _scopeId));
							else _push(`<strong class="statistics-card__value" data-v-693f536c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatCount(card.assignments))}</strong>`);
							_push(`</span><span class="statistics-card__metric statistics-card__metric--kbli" data-v-693f536c${_scopeId}><span class="statistics-card__context" data-v-693f536c${_scopeId}>KBLI</span><span class="statistics-card__label" data-v-693f536c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(card.findingLabel)}</span>`);
							if ((0, vue_exports.unref)(isStatisticsSkeletonVisible)) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "statistics-card__value-skeleton" }, null, _parent, _scopeId));
							else _push(`<strong class="statistics-card__value" data-v-693f536c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatCount(card.findings))}</strong>`);
							_push(`</span>`);
						} else return [(0, vue_exports.createVNode)("span", { class: "statistics-card__metric" }, [
							(0, vue_exports.createVNode)("span", { class: "statistics-card__context" }, "Assignment"),
							(0, vue_exports.createVNode)("span", { class: "statistics-card__label" }, (0, vue_exports.toDisplayString)(card.assignmentLabel), 1),
							(0, vue_exports.unref)(isStatisticsSkeletonVisible) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_USkeleton, {
								key: 0,
								class: "statistics-card__value-skeleton"
							})) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("strong", {
								key: 1,
								class: "statistics-card__value"
							}, (0, vue_exports.toDisplayString)(formatCount(card.assignments)), 1))
						]), (0, vue_exports.createVNode)("span", { class: "statistics-card__metric statistics-card__metric--kbli" }, [
							(0, vue_exports.createVNode)("span", { class: "statistics-card__context" }, "KBLI"),
							(0, vue_exports.createVNode)("span", { class: "statistics-card__label" }, (0, vue_exports.toDisplayString)(card.findingLabel), 1),
							(0, vue_exports.unref)(isStatisticsSkeletonVisible) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_USkeleton, {
								key: 0,
								class: "statistics-card__value-skeleton"
							})) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("strong", {
								key: 1,
								class: "statistics-card__value"
							}, (0, vue_exports.toDisplayString)(formatCount(card.findings)), 1))
						])];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></section>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(KbliFilterBar_default, {
				filters: (0, vue_exports.unref)(filters),
				search: (0, vue_exports.unref)(searchInput),
				"total-assignments": (0, vue_exports.unref)(list)?.totalAssignments ?? 0,
				"onUpdate:filters": updateFilters,
				"onUpdate:search": ($event) => searchInput.value = $event
			}, null, _parent));
			if ((0, vue_exports.unref)(mutationError)) _push(`<p class="mutation-error" role="alert" data-v-693f536c>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(mutationError))}</p>`);
			else _push(`<!---->`);
			_push(`<section class="results-section" aria-live="polite"${(0, server_renderer_exports.ssrRenderAttr)("aria-busy", (0, vue_exports.unref)(isLoading))} data-v-693f536c><div class="results-toolbar" data-v-693f536c>`);
			if ((0, vue_exports.unref)(isListSkeletonVisible)) {
				_push(`<p class="result-count" data-v-693f536c>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "result-count__skeleton" }, null, _parent));
				_push(`</p>`);
			} else if ((0, vue_exports.unref)(list)) _push(`<p class="result-count" data-v-693f536c> Menampilkan ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(rangeStart))}–${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(rangeEnd))} dari ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(list).totalAssignments)} assignment </p>`);
			else _push(`<!---->`);
			_push(`</div>`);
			if ((0, vue_exports.unref)(listError)) _push(`<div class="empty-state" role="alert" data-v-693f536c><span class="empty-state__icon" aria-hidden="true" data-v-693f536c>!</span><div data-v-693f536c><strong data-v-693f536c>Data KBLI tidak dapat dimuat.</strong><p data-v-693f536c>Periksa koneksi database, lalu muat ulang halaman.</p></div></div>`);
			else if (!(0, vue_exports.unref)(hasGroups) && !(0, vue_exports.unref)(isLoading)) _push(`<div class="empty-state" data-v-693f536c><span class="empty-state__icon" aria-hidden="true" data-v-693f536c>0</span><div data-v-693f536c><strong data-v-693f536c>Tidak ada assignment yang cocok.</strong><p data-v-693f536c>Ubah atau reset filter untuk melihat temuan KBLI lainnya.</p></div></div>`);
			else {
				_push(`<div class="table-scroll" data-v-693f536c><table class="assignment-table" data-v-693f536c><thead data-v-693f536c><tr data-v-693f536c><th scope="col" class="assignment-table__toggle" data-v-693f536c><span class="visually-hidden" data-v-693f536c>Detail</span></th><th scope="col" data-v-693f536c> SLS </th><th scope="col" data-v-693f536c> Wilayah </th><th scope="col" data-v-693f536c> Assignment </th><th scope="col" data-v-693f536c> Detail assignment </th><th scope="col" class="assignment-table__fasih" data-v-693f536c> FASIH </th><th scope="col" data-v-693f536c> Eksekutor </th><th scope="col" data-v-693f536c> Penanganan </th></tr></thead><tbody${(0, server_renderer_exports.ssrRenderAttr)("aria-label", (0, vue_exports.unref)(isListSkeletonVisible) ? "Memuat data KBLI" : void 0)} data-v-693f536c>`);
				if ((0, vue_exports.unref)(isListSkeletonVisible)) {
					_push(`<!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(7, (index) => {
						_push(`<tr class="assignment-table__skeleton-row" data-v-693f536c><td class="assignment-table__skeleton-toggle" data-v-693f536c>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-icon" }, null, _parent));
						_push(`</td><td data-v-693f536c>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-primary" }, null, _parent));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-secondary" }, null, _parent));
						_push(`</td><td data-v-693f536c>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-primary" }, null, _parent));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-secondary" }, null, _parent));
						_push(`</td><td data-v-693f536c>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-primary assignment-table__skeleton-primary--wide" }, null, _parent));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-secondary" }, null, _parent));
						_push(`</td><td data-v-693f536c>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-badge" }, null, _parent));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-secondary assignment-table__skeleton-secondary--wide" }, null, _parent));
						_push(`</td><td class="assignment-table__skeleton-fasih" data-v-693f536c>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-icon" }, null, _parent));
						_push(`</td><td data-v-693f536c>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-primary assignment-table__skeleton-primary--short" }, null, _parent));
						_push(`</td><td data-v-693f536c>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-primary assignment-table__skeleton-primary--short" }, null, _parent));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-action" }, null, _parent));
						_push(`</td></tr>`);
					});
					_push(`<!--]-->`);
				} else {
					_push(`<!--[-->`);
					(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(list)?.groups, (group) => {
						_push((0, server_renderer_exports.ssrRenderComponent)(KbliAssignmentGroup_default, {
							key: group.assignmentId,
							group,
							expanded: Boolean((0, vue_exports.unref)(expandedAssignments)[group.assignmentId]),
							saving: (0, vue_exports.unref)(saving),
							"saving-executor": Boolean((0, vue_exports.unref)(executorSaving)[group.assignmentId]),
							"expanded-data": (0, vue_exports.unref)(expandedData),
							"executor-options": (0, vue_exports.unref)(executors) ?? [],
							onToggleAssignment: ($event) => toggleAssignment(group.assignmentId),
							onToggleData: toggleData,
							onToggleHandling: ($event) => toggleHandling(group, $event),
							onUpdateExecutor: ($event) => updateAssignmentExecutor(group, $event)
						}, null, _parent));
					});
					_push(`<!--]-->`);
				}
				_push(`</tbody></table></div>`);
			}
			if ((0, vue_exports.unref)(list) && (0, vue_exports.unref)(list).totalPages > 1) {
				_push(`<nav class="pagination" aria-label="Halaman assignment" data-v-693f536c>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Sebelumnya",
					color: "neutral",
					variant: "outline",
					disabled: (0, vue_exports.unref)(list).page === 1,
					onClick: ($event) => page.value = (0, vue_exports.unref)(list).page - 1
				}, null, _parent));
				_push(`<span data-v-693f536c>Halaman ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(list).page)} / ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(list).totalPages)}</span>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Berikutnya",
					color: "neutral",
					variant: "outline",
					disabled: (0, vue_exports.unref)(list).page === (0, vue_exports.unref)(list).totalPages,
					onClick: ($event) => page.value = (0, vue_exports.unref)(list).page + 1
				}, null, _parent));
				_push(`</nav>`);
			} else _push(`<!---->`);
			_push(`</section></main>`);
		};
	}
});
//#endregion
//#region app/pages/kbli.vue
var _sfc_setup = kbli_vue_vue_type_script_setup_true_lang_default.setup;
kbli_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/kbli.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var kbli_default = /*#__PURE__*/ _plugin_vue_export_helper_default(kbli_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-693f536c"]]);

export { kbli_default as default };
//# sourceMappingURL=kbli-C-iNNt_p.mjs.map
