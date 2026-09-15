import { _ as _plugin_vue_export_helper_default, v as vue_exports, u as useToast, s as server_renderer_exports, a as _sfc_main, $ as $fetch$2, b as _sfc_main$5$1 } from '../virtual/entry.mjs';
import { _ as _sfc_main$4 } from './SelectMenu-DtagK2wf.mjs';
import { u as useFetch, A as AppNavbar_default, _ as _sfc_main$1, a as _sfc_main$3 } from './fetch-DCvyPg_e.mjs';
import { u as useDelayedPending, _ as _sfc_main$6, a as _sfc_main$1$2 } from './Slideover-TqYMRGsh.mjs';
import { _ as _sfc_main$5 } from './Badge-C_GhtgSf.mjs';
import { _ as _sfc_main$1$1, a as _sfc_main$2 } from './FileUpload-Bhdgt3US.mjs';
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

//#region app/components/anomali/AnomaliDataPreview.vue?vue&type=script&setup=true&lang.ts
var PREVIEW_LIMIT = 2;
var AnomaliDataPreview_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "AnomaliDataPreview",
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
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "data-preview" }, _attrs))} data-v-617fc0b0>`);
			if ((0, vue_exports.unref)(isStructured)) {
				_push(`<dl data-v-617fc0b0><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(visibleRows), (entry) => {
					_push(`<div data-v-617fc0b0><dt data-v-617fc0b0>${(0, server_renderer_exports.ssrInterpolate)(entry.label)}</dt><dd data-v-617fc0b0>${(0, server_renderer_exports.ssrInterpolate)(entry.value)}</dd></div>`);
				});
				_push(`<!--]--></dl>`);
			} else _push(`<pre class="data-raw" data-v-617fc0b0>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(visibleRaw))}</pre>`);
			if ((0, vue_exports.unref)(hasMore)) _push(`<button type="button" class="data-toggle"${(0, server_renderer_exports.ssrRenderAttr)("aria-expanded", __props.expanded)} data-v-617fc0b0>${(0, server_renderer_exports.ssrInterpolate)(__props.expanded ? "Ringkas" : "Lihat semua")}</button>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/components/anomali/AnomaliDataPreview.vue
var _sfc_setup$4 = AnomaliDataPreview_vue_vue_type_script_setup_true_lang_default.setup;
AnomaliDataPreview_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/anomali/AnomaliDataPreview.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var AnomaliDataPreview_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(AnomaliDataPreview_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-617fc0b0"]]), { __name: "AnomaliDataPreview" });
//#endregion
//#region app/components/anomali/AnomaliRow.vue?vue&type=script&setup=true&lang.ts
var AnomaliRow_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "AnomaliRow",
	__ssrInlineRender: true,
	props: {
		anomaly: {},
		expanded: { type: Boolean },
		saving: { type: Boolean }
	},
	emits: [
		"toggle-data",
		"toggle-handling",
		"toggle-field-condition"
	],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$5$1;
			_push(`<tr${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "anomaly-row" }, _attrs))} data-v-0d7d9749><td class="anomaly-cell anomaly-cell--code" data-v-0d7d9749><span class="anomaly-code" data-v-0d7d9749>${(0, server_renderer_exports.ssrInterpolate)(__props.anomaly.kodeAnomali)}</span></td><td class="anomaly-cell anomaly-cell--description" data-v-0d7d9749><p data-v-0d7d9749>${(0, server_renderer_exports.ssrInterpolate)(__props.anomaly.deskripsi)}</p>`);
			if (__props.anomaly.catatan) _push(`<p class="anomaly-note" data-v-0d7d9749><strong data-v-0d7d9749>Catatan:</strong> ${(0, server_renderer_exports.ssrInterpolate)(__props.anomaly.catatan)}</p>`);
			else _push(`<!---->`);
			_push(`</td><td class="anomaly-cell anomaly-cell--data" data-v-0d7d9749>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(AnomaliDataPreview_default, {
				data: __props.anomaly.data,
				expanded: __props.expanded,
				onToggle: ($event) => emit("toggle-data")
			}, null, _parent));
			_push(`</td><td class="anomaly-cell anomaly-cell--status" data-v-0d7d9749><span class="${(0, server_renderer_exports.ssrRenderClass)([__props.anomaly.isActive && !__props.anomaly.isHandled && !__props.anomaly.isSesuaiLapangan ? "handling-status--pending" : __props.anomaly.isActive && __props.anomaly.isSesuaiLapangan ? "handling-status--field-condition" : "handling-status--done", "handling-status"])}" data-v-0d7d9749>${(0, server_renderer_exports.ssrInterpolate)(!__props.anomaly.isActive ? "Selesai + anomali hilang" : __props.anomaly.isSesuaiLapangan ? "Sesuai kondisi lapangan" : __props.anomaly.isHandled ? "Selesai (tandai)" : "Belum selesai")}</span></td><td class="anomaly-cell anomaly-cell--action" data-v-0d7d9749>`);
			if (__props.anomaly.isActive) {
				_push(`<div class="anomaly-actions" data-v-0d7d9749>`);
				if (__props.anomaly.isSesuaiLapangan) {
					_push(`<button type="button" class="anomaly-action"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(__props.saving) ? " disabled" : ""} data-v-0d7d9749>`);
					if (__props.saving) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-lucide-loader-circle",
						class: "anomaly-action__icon loading-icon",
						"aria-hidden": "true"
					}, null, _parent));
					else _push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-lucide-undo-2",
						class: "anomaly-action__icon",
						"aria-hidden": "true"
					}, null, _parent));
					_push(` ${(0, server_renderer_exports.ssrInterpolate)(__props.saving ? "Memproses" : "Batalkan")}</button>`);
				} else if (__props.anomaly.isHandled) {
					_push(`<button type="button" class="anomaly-action"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(__props.saving) ? " disabled" : ""} data-v-0d7d9749>`);
					if (__props.saving) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-lucide-loader-circle",
						class: "anomaly-action__icon loading-icon",
						"aria-hidden": "true"
					}, null, _parent));
					else _push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-lucide-undo-2",
						class: "anomaly-action__icon",
						"aria-hidden": "true"
					}, null, _parent));
					_push(` ${(0, server_renderer_exports.ssrInterpolate)(__props.saving ? "Memproses" : "Batalkan")}</button>`);
				} else {
					_push(`<!--[--><button type="button" class="anomaly-action"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(__props.saving) ? " disabled" : ""} data-v-0d7d9749>`);
					if (__props.saving) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-lucide-loader-circle",
						class: "anomaly-action__icon loading-icon",
						"aria-hidden": "true"
					}, null, _parent));
					else _push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-lucide-check",
						class: "anomaly-action__icon",
						"aria-hidden": "true"
					}, null, _parent));
					_push(` ${(0, server_renderer_exports.ssrInterpolate)(__props.saving ? "Memproses" : "Tandai selesai")}</button><button type="button" class="anomaly-action"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(__props.saving) ? " disabled" : ""} data-v-0d7d9749>`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-lucide-flag",
						class: "anomaly-action__icon",
						"aria-hidden": "true"
					}, null, _parent));
					_push(` Sesuai kondisi lapangan </button><!--]-->`);
				}
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</td></tr>`);
		};
	}
});
//#endregion
//#region app/components/anomali/AnomaliRow.vue
var _sfc_setup$3 = AnomaliRow_vue_vue_type_script_setup_true_lang_default.setup;
AnomaliRow_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/anomali/AnomaliRow.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var AnomaliRow_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(AnomaliRow_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-0d7d9749"]]), { __name: "AnomaliRow" });
//#endregion
//#region app/components/anomali/AnomaliAssignmentGroup.vue?vue&type=script&setup=true&lang.ts
var UNASSIGNED_EXECUTOR_VALUE = "__unassigned__";
var AnomaliAssignmentGroup_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "AnomaliAssignmentGroup",
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
		"toggle-field-condition",
		"update-executor"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const detailsId = (0, vue_exports.computed)(() => `assignment-${encodeURIComponent(props.group.assignmentId)}`);
		const hasActiveAnomalies = (0, vue_exports.computed)(() => props.group.anomalies.some((anomaly) => anomaly.isActive));
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
			const _component_UIcon = _sfc_main$5$1;
			const _component_UTooltip = _sfc_main$1$2;
			const _component_USelectMenu = _sfc_main$4;
			_push(`<!--[--><tr class="${(0, server_renderer_exports.ssrRenderClass)([{ "assignment-row--expanded": __props.expanded }, "assignment-row"])}" data-v-505ad4ea><td class="assignment-cell assignment-cell--toggle" data-v-505ad4ea>`);
			if ((0, vue_exports.unref)(hasActiveAnomalies)) {
				_push(`<button type="button" class="assignment-toggle"${(0, server_renderer_exports.ssrRenderAttr)("aria-controls", (0, vue_exports.unref)(detailsId))}${(0, server_renderer_exports.ssrRenderAttr)("aria-expanded", __props.expanded)}${(0, server_renderer_exports.ssrRenderAttr)("aria-label", __props.expanded ? `Tutup detail ${__props.group.assignmentId}` : `Buka detail ${__props.group.assignmentId}`)} data-v-505ad4ea>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: __props.expanded ? "i-lucide-chevron-down" : "i-lucide-chevron-right",
					"aria-hidden": "true"
				}, null, _parent));
				_push(`</button>`);
			} else _push(`<!---->`);
			_push(`</td><td class="assignment-cell" data-v-505ad4ea><span class="cell-primary" data-v-505ad4ea>${(0, server_renderer_exports.ssrInterpolate)(__props.group.wilayah.namaSls || "—")}</span><span class="cell-secondary" data-v-505ad4ea>${(0, server_renderer_exports.ssrInterpolate)(__props.group.wilayah.idSubsls)}</span></td><td class="assignment-cell" data-v-505ad4ea><span class="cell-primary" data-v-505ad4ea>${(0, server_renderer_exports.ssrInterpolate)(__props.group.wilayah.kecamatan || "—")}</span><span class="cell-secondary" data-v-505ad4ea>${(0, server_renderer_exports.ssrInterpolate)(__props.group.wilayah.desa || "—")}</span></td><td class="assignment-cell" data-v-505ad4ea><span class="cell-primary assignment-name" data-v-505ad4ea>${(0, server_renderer_exports.ssrInterpolate)(__props.group.namaAssignment || "Tanpa nama assignment")}</span></td><td class="assignment-cell" data-v-505ad4ea><span class="${(0, server_renderer_exports.ssrRenderClass)([`source-status--${sourceStatusTone(__props.group.statusAlias)}`, "source-status"])}" data-v-505ad4ea>${(0, server_renderer_exports.ssrInterpolate)(__props.group.statusAlias || "Status FASIH tidak tersedia")}</span><span class="cell-secondary" data-v-505ad4ea>No. Bang: ${(0, server_renderer_exports.ssrInterpolate)(__props.group.nomorBangunan || "—")} · SBR: ${(0, server_renderer_exports.ssrInterpolate)(__props.group.idsbr || "—")}</span></td><td class="assignment-cell assignment-cell--fasih" data-v-505ad4ea>`);
			if (__props.group.linkFasihEdit) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UTooltip, { text: "Buka di FASIH" }, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<a${(0, server_renderer_exports.ssrRenderAttr)("href", __props.group.linkFasihEdit)} target="_blank" rel="noopener noreferrer" class="assignment-fasih-link"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", `Buka assignment ${__props.group.assignmentId} di FASIH`)} data-v-505ad4ea${_scopeId}>`);
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
			else _push(`<span class="cell-secondary" data-v-505ad4ea>—</span>`);
			_push(`</td><td class="assignment-cell assignment-cell--executor" data-v-505ad4ea>`);
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
			_push(`</td><td class="assignment-cell assignment-cell--handling" data-v-505ad4ea><span class="handling-progress"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", `${__props.group.summary.handled} dari ${__props.group.summary.total} anomali selesai`)} data-v-505ad4ea>${(0, server_renderer_exports.ssrInterpolate)(__props.group.summary.handled)}/${(0, server_renderer_exports.ssrInterpolate)(__props.group.summary.total)} selesai </span></td></tr>`);
			if (__props.expanded) {
				_push(`<tr class="assignment-detail-row" data-v-505ad4ea><td${(0, server_renderer_exports.ssrRenderAttr)("colspan", 8)} class="assignment-detail-cell" data-v-505ad4ea><div${(0, server_renderer_exports.ssrRenderAttr)("id", (0, vue_exports.unref)(detailsId))} class="assignment-detail" data-v-505ad4ea><table class="anomaly-table" data-v-505ad4ea><thead data-v-505ad4ea><tr data-v-505ad4ea><th scope="col" class="anomaly-table__code" data-v-505ad4ea> Jenis </th><th scope="col" class="anomaly-table__description" data-v-505ad4ea> Keterangan anomali </th><th scope="col" class="anomaly-table__data" data-v-505ad4ea> Data anomali </th><th scope="col" class="anomaly-table__status" data-v-505ad4ea> Status </th><th scope="col" class="anomaly-table__action" data-v-505ad4ea> Aksi </th></tr></thead><tbody data-v-505ad4ea><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(__props.group.anomalies, (anomaly) => {
					_push((0, server_renderer_exports.ssrRenderComponent)(AnomaliRow_default, {
						key: anomaly.id,
						anomaly,
						expanded: Boolean(__props.expandedData[anomaly.id]),
						saving: Boolean(__props.saving[anomaly.id]),
						onToggleData: ($event) => emit("toggle-data", anomaly.id),
						onToggleHandling: ($event) => emit("toggle-handling", anomaly),
						onToggleFieldCondition: ($event) => emit("toggle-field-condition", anomaly)
					}, null, _parent));
				});
				_push(`<!--]--></tbody></table></div></td></tr>`);
			} else _push(`<!---->`);
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region app/components/anomali/AnomaliAssignmentGroup.vue
var _sfc_setup$2 = AnomaliAssignmentGroup_vue_vue_type_script_setup_true_lang_default.setup;
AnomaliAssignmentGroup_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/anomali/AnomaliAssignmentGroup.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var AnomaliAssignmentGroup_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(AnomaliAssignmentGroup_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-505ad4ea"]]), { __name: "AnomaliAssignmentGroup" });
//#endregion
//#region app/components/anomali/AnomaliFilterBar.vue?vue&type=script&setup=true&lang.ts
var ALL_VALUE = "__all__";
var AnomaliFilterBar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "AnomaliFilterBar",
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
			pml: "",
			isActive: ""
		});
		const regionOptionsQuery = (0, vue_exports.computed)(() => ({
			kecamatan: draftRegionFilters.kecamatan || void 0,
			desa: draftRegionFilters.desa || void 0,
			namaSls: draftRegionFilters.namaSls || void 0,
			ppl: draftRegionFilters.ppl || void 0,
			pml: draftRegionFilters.pml || void 0
		}));
		const { data: regionOptions, status: regionOptionsStatus } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useFetch("/api/anomali/filter-options", { query: regionOptionsQuery }, "$wtEdfq4ZnM")), __temp = await __temp, __restore(), __temp);
		const handlingTabs = [
			{
				label: "Belum selesai",
				value: "unhandled"
			},
			{
				label: "Selesai (tandai)",
				value: "handled"
			},
			{
				label: "Selesai + anomali hilang",
				value: "disappeared"
			}
		];
		const selectedHandlingLabel = (0, vue_exports.computed)(() => handlingTabs.find((tab) => tab.value === toSelectValue(props.filters.completionStatus))?.label ?? "Status penanganan");
		const anomalyOptions = (0, vue_exports.computed)(() => [{
			label: "Semua anomali",
			value: ALL_VALUE
		}, ...regionOptions.value?.anomalyCodes.map((anomaly) => ({
			label: `${anomaly.kodeAnomali} — ${anomaly.deskripsi}`,
			value: anomaly.kodeAnomali.trim()
		})).filter((anomaly) => anomaly.value.length > 0) ?? []]);
		const kecamatanOptions = (0, vue_exports.computed)(() => selectItems(regionOptions.value?.kecamatan, "Semua kecamatan"));
		const desaOptions = (0, vue_exports.computed)(() => selectItems(regionOptions.value?.desa, "Semua desa"));
		const slsOptions = (0, vue_exports.computed)(() => selectItems(regionOptions.value?.namaSls, "Semua SLS"));
		const pplOptions = (0, vue_exports.computed)(() => selectItems(regionOptions.value?.ppl, "Semua PPL"));
		const pmlOptions = (0, vue_exports.computed)(() => selectItems(regionOptions.value?.pml, "Semua PML"));
		const activeOptions = [
			{
				label: "Semua status sistem",
				value: ALL_VALUE
			},
			{
				label: "Aktif",
				value: "true"
			},
			{
				label: "Hilang by sistem",
				value: "false"
			}
		];
		const activeRegionFilterCount = (0, vue_exports.computed)(() => Object.values({
			kecamatan: props.filters.kecamatan,
			desa: props.filters.desa,
			namaSls: props.filters.namaSls,
			ppl: props.filters.ppl,
			pml: props.filters.pml,
			isActive: props.filters.isActive
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
				pml: props.filters.pml,
				isActive: props.filters.isActive
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
				pml: "",
				isActive: ""
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
			const _component_USelectMenu = _sfc_main$4;
			const _component_UBadge = _sfc_main$5;
			const _component_UInput = _sfc_main$3;
			const _component_USlideover = _sfc_main$6;
			const _component_UButton = _sfc_main;
			_push(`<section${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({
				class: "filter-toolbar",
				"aria-label": "Filter anomali"
			}, _attrs))} data-v-cf55b08f><div class="filter-toolbar__summary" data-v-cf55b08f>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
				"model-value": __props.filters.completionStatus || void 0,
				items: handlingTabs,
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
			_push(`<div class="filter-toolbar__total" aria-live="polite" data-v-cf55b08f>`);
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
			_push(`<span data-v-cf55b08f>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(selectedHandlingLabel))}</span></div></div><div class="filter-toolbar__controls" data-v-cf55b08f>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
				"model-value": __props.search,
				class: "filter-toolbar__search",
				color: "neutral",
				variant: "outline",
				size: "md",
				icon: "i-lucide-search",
				ui: lightInputUi,
				type: "search",
				placeholder: "Cari assignment, nama, bangunan, IDSBR...",
				"onUpdate:modelValue": updateSearch
			}, null, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
				"model-value": toSelectValue(__props.filters.kodeAnomali),
				items: (0, vue_exports.unref)(anomalyOptions),
				"value-key": "value",
				color: "neutral",
				variant: "outline",
				size: "md",
				class: "filter-toolbar__anomaly",
				ui: lightSelectMenuUi,
				"search-input": {
					autofocus: false,
					icon: "i-lucide-search",
					placeholder: "Cari anomali..."
				},
				loading: (0, vue_exports.unref)(isRegionOptionsLoading),
				"onUpdate:modelValue": ($event) => updateQuickFilter("kodeAnomali", String($event ?? ""))
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
						_push(`<div class="region-drawer" data-v-cf55b08f${_scopeId}><label class="region-drawer__field" data-v-cf55b08f${_scopeId}><span data-v-cf55b08f${_scopeId}>Kecamatan</span>`);
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
						_push(`</label><label class="region-drawer__field" data-v-cf55b08f${_scopeId}><span data-v-cf55b08f${_scopeId}>Desa</span>`);
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
						_push(`</label><label class="region-drawer__field" data-v-cf55b08f${_scopeId}><span data-v-cf55b08f${_scopeId}>SLS</span>`);
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
						_push(`</label><label class="region-drawer__field" data-v-cf55b08f${_scopeId}><span data-v-cf55b08f${_scopeId}>PML</span>`);
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
						_push(`</label><label class="region-drawer__field" data-v-cf55b08f${_scopeId}><span data-v-cf55b08f${_scopeId}>PPL</span>`);
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
						_push(`</label><label class="region-drawer__field" data-v-cf55b08f${_scopeId}><span data-v-cf55b08f${_scopeId}>Keberadaan sistem</span>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
							"model-value": toSelectValue((0, vue_exports.unref)(draftRegionFilters).isActive),
							items: activeOptions,
							"value-key": "value",
							color: "neutral",
							variant: "outline",
							size: "md",
							ui: lightSelectMenuUi,
							"search-input": false,
							"onUpdate:modelValue": ($event) => updateDraftRegionFilter("isActive", String($event ?? ""))
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
						])]),
						(0, vue_exports.createVNode)("label", { class: "region-drawer__field" }, [(0, vue_exports.createVNode)("span", null, "Keberadaan sistem"), (0, vue_exports.createVNode)(_component_USelectMenu, {
							"model-value": toSelectValue((0, vue_exports.unref)(draftRegionFilters).isActive),
							items: activeOptions,
							"value-key": "value",
							color: "neutral",
							variant: "outline",
							size: "md",
							ui: lightSelectMenuUi,
							"search-input": false,
							"onUpdate:modelValue": ($event) => updateDraftRegionFilter("isActive", String($event ?? ""))
						}, null, 8, ["model-value", "onUpdate:modelValue"])])
					])];
				}),
				footer: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="region-drawer__actions" data-v-cf55b08f${_scopeId}>`);
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
								_push(`<span data-v-cf55b08f${_scopeId}>Filter Wilayah</span>`);
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
//#region app/components/anomali/AnomaliFilterBar.vue
var _sfc_setup$1 = AnomaliFilterBar_vue_vue_type_script_setup_true_lang_default.setup;
AnomaliFilterBar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/anomali/AnomaliFilterBar.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var AnomaliFilterBar_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(AnomaliFilterBar_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-cf55b08f"]]), { __name: "AnomaliFilterBar" });
//#endregion
//#region app/pages/anomali.vue?vue&type=script&setup=true&lang.ts
var PAGE_SIZE = 20;
var anomali_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "anomali",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const filters = (0, vue_exports.reactive)({
			kecamatan: "",
			desa: "",
			namaSls: "",
			ppl: "",
			pml: "",
			kodeAnomali: "",
			isActive: "",
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
		const importModalOpen = (0, vue_exports.ref)(false);
		const importFile = (0, vue_exports.ref)(null);
		const importPassword = (0, vue_exports.ref)("");
		const importPreview = (0, vue_exports.ref)(null);
		const importError = (0, vue_exports.ref)("");
		const previewingImport = (0, vue_exports.ref)(false);
		const applyingImport = (0, vue_exports.ref)(false);
		const toast = useToast();
		const importFileUploadUi = {
			base: "bg-[var(--color-paper)] border-[var(--color-rule-2)] text-[var(--color-ink-2)] hover:bg-[var(--color-paper-2)]",
			icon: "text-[var(--color-accent)]",
			label: "text-[var(--color-ink)]",
			description: "text-[var(--color-muted)]"
		};
		const importInputUi = {
			base: "bg-[var(--color-paper)] text-[var(--color-ink-2)] placeholder:text-[var(--color-muted)] ring-[var(--color-rule-2)]",
			leadingIcon: "text-[var(--color-muted)]",
			trailingIcon: "text-[var(--color-muted)]"
		};
		const listQuery = (0, vue_exports.computed)(() => ({
			page: page.value,
			pageSize: PAGE_SIZE,
			search: committedSearch.value || void 0,
			kecamatan: filters.kecamatan || void 0,
			desa: filters.desa || void 0,
			namaSls: filters.namaSls || void 0,
			ppl: filters.ppl || void 0,
			pml: filters.pml || void 0,
			kodeAnomali: filters.kodeAnomali || void 0,
			isActive: filters.isActive || void 0,
			completionStatus: filters.completionStatus || void 0
		}));
		const statisticsQuery = (0, vue_exports.computed)(() => ({
			search: committedSearch.value || void 0,
			kecamatan: filters.kecamatan || void 0,
			desa: filters.desa || void 0,
			namaSls: filters.namaSls || void 0,
			ppl: filters.ppl || void 0,
			pml: filters.pml || void 0,
			kodeAnomali: filters.kodeAnomali || void 0,
			isActive: filters.isActive || void 0
		}));
		const { data: list, status: listStatus, error: listError, refresh: refreshList } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useFetch("/api/anomali", { query: listQuery }, "$7P0bbgWuy5")), __temp = await __temp, __restore(), __temp);
		const { data: statistics, status: statisticsStatus, refresh: refreshStatistics } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useFetch("/api/anomali/statistics", { query: statisticsQuery }, "$bCl8bTfJCR")), __temp = await __temp, __restore(), __temp);
		const { data: executors } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useFetch("/api/anomali/executors", "$rz1uWuFGxf")), __temp = await __temp, __restore(), __temp);
		const statisticsCards = (0, vue_exports.computed)(() => [
			{
				assignmentLabel: "Total Assignment",
				anomalyLabel: "Total Anomali",
				assignments: statistics.value?.total.assignments ?? 0,
				anomalies: statistics.value?.total.anomalies ?? 0,
				completionStatus: ""
			},
			{
				assignmentLabel: "Belum Selesai",
				anomalyLabel: "Belum Selesai",
				assignments: statistics.value?.unhandled.assignments ?? 0,
				anomalies: statistics.value?.unhandled.anomalies ?? 0,
				completionStatus: "unhandled"
			},
			{
				assignmentLabel: "Selesai (Tandai)",
				anomalyLabel: "Selesai (Tandai)",
				assignments: statistics.value?.handled.assignments ?? 0,
				anomalies: statistics.value?.handled.anomalies ?? 0,
				completionStatus: "handled"
			},
			{
				assignmentLabel: "Selesai + Anomali Hilang",
				anomalyLabel: "Anomali Hilang",
				assignments: statistics.value?.disappeared.assignments ?? 0,
				anomalies: statistics.value?.disappeared.anomalies ?? 0,
				completionStatus: "disappeared"
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
			() => filters.kodeAnomali,
			() => filters.isActive,
			() => filters.completionStatus
		], () => {
			page.value = 1;
		});
		(0, vue_exports.watch)([importFile, importPassword], () => {
			importPreview.value = null;
			importError.value = "";
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
		function resetImportForm() {
			importFile.value = null;
			importPassword.value = "";
			importPreview.value = null;
			importError.value = "";
		}
		function openImportModal() {
			resetImportForm();
			importModalOpen.value = true;
		}
		function onImportModalUpdate(isOpen) {
			if (!isOpen) resetImportForm();
		}
		function closeImportModal() {
			importModalOpen.value = false;
			resetImportForm();
		}
		function createImportFormData() {
			if (!importFile.value) {
				importError.value = "Pilih file XLSX terlebih dahulu.";
				return null;
			}
			if (!importFile.value.name.toLowerCase().endsWith(".xlsx")) {
				importError.value = "File import harus berformat XLSX.";
				return null;
			}
			const formData = new FormData();
			formData.append("file", importFile.value);
			formData.append("password", importPassword.value);
			return formData;
		}
		function requestErrorMessage(error, fallback) {
			if (error && typeof error === "object" && "data" in error) {
				const data = error.data;
				return data?.statusMessage ?? data?.message ?? fallback;
			}
			return fallback;
		}
		async function previewImport() {
			const formData = createImportFormData();
			if (!formData || previewingImport.value) return;
			importError.value = "";
			previewingImport.value = true;
			try {
				importPreview.value = await $fetch$2("/api/anomali/import/preview", {
					method: "POST",
					body: formData
				});
			} catch (error) {
				importPreview.value = null;
				importError.value = requestErrorMessage(error, "Preview import gagal dibuat.");
			} finally {
				previewingImport.value = false;
			}
		}
		async function applyImport() {
			const formData = createImportFormData();
			if (!formData || !importPreview.value?.valid || applyingImport.value) return;
			importError.value = "";
			applyingImport.value = true;
			try {
				const result = await $fetch$2("/api/anomali/import/apply", {
					method: "POST",
					body: formData
				});
				if (!result.valid || !result.applied) {
					importPreview.value = result;
					return;
				}
				page.value = 1;
				await Promise.all([refreshList(), refreshStatistics()]);
				toast.add({
					title: "Import anomali berhasil",
					description: `${formatImportCount(result.counts.new)} baru, ${formatImportCount(result.counts.disappeared)} hilang oleh sistem.`,
					color: "success",
					icon: "i-lucide-circle-check"
				});
				closeImportModal();
			} catch (error) {
				importError.value = requestErrorMessage(error, "Import data gagal dilakukan.");
			} finally {
				applyingImport.value = false;
			}
		}
		function formatImportCount(value) {
			return new Intl.NumberFormat("id-ID").format(value);
		}
		function toggleData(id) {
			expandedData[id] = !expandedData[id];
		}
		function toggleAssignment(assignmentId) {
			expandedAssignments[assignmentId] = !expandedAssignments[assignmentId];
		}
		function isOperationallyResolved(anomaly) {
			return anomaly.isHandled || anomaly.isSesuaiLapangan;
		}
		function recalculateGroupSummary(group) {
			const active = group.anomalies.filter((anomaly) => anomaly.isActive);
			const unhandled = active.filter((anomaly) => !isOperationallyResolved(anomaly)).length;
			group.summary.total = group.anomalies.length;
			group.summary.active = active.length;
			group.summary.inactive = group.summary.total - group.summary.active;
			group.summary.unhandled = unhandled;
			group.summary.handled = group.summary.total - unhandled;
		}
		async function toggleHandling(group, anomaly) {
			if (!anomaly.isActive || saving[anomaly.id]) return;
			mutationError.value = "";
			saving[anomaly.id] = true;
			const previous = {
				isHandled: anomaly.isHandled,
				handledAt: anomaly.handledAt,
				summary: { ...group.summary }
			};
			const nextIsHandled = !anomaly.isHandled;
			anomaly.isHandled = nextIsHandled;
			anomaly.handledAt = nextIsHandled ? (/* @__PURE__ */ new Date()).toISOString() : null;
			recalculateGroupSummary(group);
			try {
				const result = await $fetch$2(`/api/anomali/${anomaly.id}/handling`, {
					method: "PATCH",
					body: { isHandled: nextIsHandled }
				});
				anomaly.isHandled = result.isHandled;
				anomaly.handledAt = result.handledAt;
			} catch {
				anomaly.isHandled = previous.isHandled;
				anomaly.handledAt = previous.handledAt;
				Object.assign(group.summary, previous.summary);
				mutationError.value = "Status penanganan gagal diperbarui. Perubahan lokal dikembalikan.";
			} finally {
				saving[anomaly.id] = false;
			}
		}
		async function toggleFieldCondition(group, anomaly) {
			if (!anomaly.isActive || saving[anomaly.id]) return;
			mutationError.value = "";
			saving[anomaly.id] = true;
			const previous = {
				isSesuaiLapangan: anomaly.isSesuaiLapangan,
				sesuaiLapanganAt: anomaly.sesuaiLapanganAt,
				summary: { ...group.summary }
			};
			const nextIsSesuaiLapangan = !anomaly.isSesuaiLapangan;
			anomaly.isSesuaiLapangan = nextIsSesuaiLapangan;
			anomaly.sesuaiLapanganAt = nextIsSesuaiLapangan ? (/* @__PURE__ */ new Date()).toISOString() : null;
			recalculateGroupSummary(group);
			try {
				const result = await $fetch$2(`/api/anomali/${anomaly.id}/field-condition`, {
					method: "PATCH",
					body: { isSesuaiLapangan: nextIsSesuaiLapangan }
				});
				anomaly.isSesuaiLapangan = result.isSesuaiLapangan;
				anomaly.sesuaiLapanganAt = result.sesuaiLapanganAt;
				recalculateGroupSummary(group);
			} catch {
				anomaly.isSesuaiLapangan = previous.isSesuaiLapangan;
				anomaly.sesuaiLapanganAt = previous.sesuaiLapanganAt;
				Object.assign(group.summary, previous.summary);
				mutationError.value = "Status kondisi lapangan gagal diperbarui. Perubahan lokal dikembalikan.";
			} finally {
				saving[anomaly.id] = false;
			}
		}
		async function updateAssignmentExecutor(group, eksekutorId) {
			if (executorSaving[group.assignmentId]) return;
			mutationError.value = "";
			executorSaving[group.assignmentId] = true;
			const previous = group.executor;
			group.executor = eksekutorId ? executors.value?.find((executor) => executor.id === eksekutorId) ?? null : null;
			try {
				group.executor = (await $fetch$2(`/api/anomali/assignment/${encodeURIComponent(group.assignmentId)}/executor`, {
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
			const _component_USkeleton = _sfc_main$1;
			const _component_UModal = _sfc_main$1$1;
			const _component_UFileUpload = _sfc_main$2;
			const _component_UInput = _sfc_main$3;
			_push(`<main${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "anomali-page" }, _attrs))} data-v-edee2a50>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_AppNavbar, null, {
				actions: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
						label: "Import XLSX",
						icon: "i-lucide-upload",
						color: "neutral",
						variant: "outline",
						size: "sm",
						onClick: openImportModal
					}, null, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UButton, {
						label: "Import XLSX",
						icon: "i-lucide-upload",
						color: "neutral",
						variant: "outline",
						size: "sm",
						onClick: openImportModal
					})];
				}),
				_: 1
			}, _parent));
			_push(`<section class="page-heading" aria-labelledby="page-title" data-v-edee2a50><div data-v-edee2a50><h1 id="page-title" data-v-edee2a50> Penanganan Anomali </h1><p class="page-heading__description" data-v-edee2a50> Satu baris untuk satu assignment. Buka detail untuk meninjau dan menangani seluruh anomalinya. </p></div></section><section class="statistics-row" aria-label="Statistik assignment anomali" data-v-edee2a50><!--[-->`);
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
							_push(`<span class="statistics-card__metric" data-v-edee2a50${_scopeId}><span class="statistics-card__context" data-v-edee2a50${_scopeId}>Assignment</span><span class="statistics-card__label" data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(card.assignmentLabel)}</span>`);
							if ((0, vue_exports.unref)(isStatisticsSkeletonVisible)) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "statistics-card__value-skeleton" }, null, _parent, _scopeId));
							else _push(`<strong class="statistics-card__value" data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatImportCount(card.assignments))}</strong>`);
							_push(`</span><span class="statistics-card__metric statistics-card__metric--anomaly" data-v-edee2a50${_scopeId}><span class="statistics-card__context" data-v-edee2a50${_scopeId}>Anomali</span><span class="statistics-card__label" data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(card.anomalyLabel)}</span>`);
							if ((0, vue_exports.unref)(isStatisticsSkeletonVisible)) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "statistics-card__value-skeleton" }, null, _parent, _scopeId));
							else _push(`<strong class="statistics-card__value" data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatImportCount(card.anomalies))}</strong>`);
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
							}, (0, vue_exports.toDisplayString)(formatImportCount(card.assignments)), 1))
						]), (0, vue_exports.createVNode)("span", { class: "statistics-card__metric statistics-card__metric--anomaly" }, [
							(0, vue_exports.createVNode)("span", { class: "statistics-card__context" }, "Anomali"),
							(0, vue_exports.createVNode)("span", { class: "statistics-card__label" }, (0, vue_exports.toDisplayString)(card.anomalyLabel), 1),
							(0, vue_exports.unref)(isStatisticsSkeletonVisible) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_USkeleton, {
								key: 0,
								class: "statistics-card__value-skeleton"
							})) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("strong", {
								key: 1,
								class: "statistics-card__value"
							}, (0, vue_exports.toDisplayString)(formatImportCount(card.anomalies)), 1))
						])];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></section>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(AnomaliFilterBar_default, {
				filters: (0, vue_exports.unref)(filters),
				search: (0, vue_exports.unref)(searchInput),
				"total-assignments": (0, vue_exports.unref)(list)?.totalAssignments ?? 0,
				"onUpdate:filters": updateFilters,
				"onUpdate:search": ($event) => searchInput.value = $event
			}, null, _parent));
			if ((0, vue_exports.unref)(mutationError)) _push(`<p class="mutation-error" role="alert" data-v-edee2a50>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(mutationError))}</p>`);
			else _push(`<!---->`);
			_push(`<section class="results-section" aria-live="polite"${(0, server_renderer_exports.ssrRenderAttr)("aria-busy", (0, vue_exports.unref)(isLoading))} data-v-edee2a50><div class="results-toolbar" data-v-edee2a50>`);
			if ((0, vue_exports.unref)(isListSkeletonVisible)) {
				_push(`<p class="result-count" data-v-edee2a50>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "result-count__skeleton" }, null, _parent));
				_push(`</p>`);
			} else if ((0, vue_exports.unref)(list)) _push(`<p class="result-count" data-v-edee2a50> Menampilkan ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(rangeStart))}–${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(rangeEnd))} dari ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(list).totalAssignments)} assignment </p>`);
			else _push(`<!---->`);
			_push(`</div>`);
			if ((0, vue_exports.unref)(listError)) _push(`<div class="empty-state" role="alert" data-v-edee2a50><span class="empty-state__icon" aria-hidden="true" data-v-edee2a50>!</span><div data-v-edee2a50><strong data-v-edee2a50>Data anomali tidak dapat dimuat.</strong><p data-v-edee2a50>Periksa koneksi database, lalu muat ulang halaman.</p></div></div>`);
			else if (!(0, vue_exports.unref)(hasGroups) && !(0, vue_exports.unref)(isLoading)) _push(`<div class="empty-state" data-v-edee2a50><span class="empty-state__icon" aria-hidden="true" data-v-edee2a50>0</span><div data-v-edee2a50><strong data-v-edee2a50>Tidak ada assignment yang cocok.</strong><p data-v-edee2a50>Ubah atau reset filter untuk melihat anomali lainnya.</p></div></div>`);
			else {
				_push(`<div class="table-scroll" data-v-edee2a50><table class="assignment-table" data-v-edee2a50><thead data-v-edee2a50><tr data-v-edee2a50><th scope="col" class="assignment-table__toggle" data-v-edee2a50><span class="visually-hidden" data-v-edee2a50>Detail</span></th><th scope="col" data-v-edee2a50> SLS </th><th scope="col" data-v-edee2a50> Wilayah </th><th scope="col" data-v-edee2a50> Assignment </th><th scope="col" data-v-edee2a50> Detail assignment </th><th scope="col" class="assignment-table__fasih" data-v-edee2a50> FASIH </th><th scope="col" data-v-edee2a50> Eksekutor </th><th scope="col" data-v-edee2a50> Penanganan </th></tr></thead><tbody${(0, server_renderer_exports.ssrRenderAttr)("aria-label", (0, vue_exports.unref)(isListSkeletonVisible) ? "Memuat data anomali" : void 0)} data-v-edee2a50>`);
				if ((0, vue_exports.unref)(isListSkeletonVisible)) {
					_push(`<!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(7, (index) => {
						_push(`<tr class="assignment-table__skeleton-row" data-v-edee2a50><td class="assignment-table__skeleton-toggle" data-v-edee2a50>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-icon" }, null, _parent));
						_push(`</td><td data-v-edee2a50>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-primary" }, null, _parent));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-secondary" }, null, _parent));
						_push(`</td><td data-v-edee2a50>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-primary" }, null, _parent));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-secondary" }, null, _parent));
						_push(`</td><td data-v-edee2a50>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-primary assignment-table__skeleton-primary--wide" }, null, _parent));
						_push(`</td><td data-v-edee2a50>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-badge" }, null, _parent));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-secondary assignment-table__skeleton-secondary--wide" }, null, _parent));
						_push(`</td><td class="assignment-table__skeleton-fasih" data-v-edee2a50>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-icon" }, null, _parent));
						_push(`</td><td data-v-edee2a50>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-primary assignment-table__skeleton-primary--short" }, null, _parent));
						_push(`</td><td data-v-edee2a50>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-primary assignment-table__skeleton-primary--short" }, null, _parent));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "assignment-table__skeleton-action" }, null, _parent));
						_push(`</td></tr>`);
					});
					_push(`<!--]-->`);
				} else {
					_push(`<!--[-->`);
					(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(list)?.groups, (group) => {
						_push((0, server_renderer_exports.ssrRenderComponent)(AnomaliAssignmentGroup_default, {
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
							onToggleFieldCondition: ($event) => toggleFieldCondition(group, $event),
							onUpdateExecutor: ($event) => updateAssignmentExecutor(group, $event)
						}, null, _parent));
					});
					_push(`<!--]-->`);
				}
				_push(`</tbody></table></div>`);
			}
			if ((0, vue_exports.unref)(list) && (0, vue_exports.unref)(list).totalPages > 1) {
				_push(`<nav class="pagination" aria-label="Halaman assignment" data-v-edee2a50>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Sebelumnya",
					color: "neutral",
					variant: "outline",
					disabled: (0, vue_exports.unref)(list).page === 1,
					onClick: ($event) => page.value = (0, vue_exports.unref)(list).page - 1
				}, null, _parent));
				_push(`<span data-v-edee2a50>Halaman ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(list).page)} / ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(list).totalPages)}</span>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Berikutnya",
					color: "neutral",
					variant: "outline",
					disabled: (0, vue_exports.unref)(list).page === (0, vue_exports.unref)(list).totalPages,
					onClick: ($event) => page.value = (0, vue_exports.unref)(list).page + 1
				}, null, _parent));
				_push(`</nav>`);
			} else _push(`<!---->`);
			_push(`</section>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(importModalOpen),
				"onUpdate:open": [($event) => (0, vue_exports.isRef)(importModalOpen) ? importModalOpen.value = $event : null, onImportModalUpdate],
				title: "Import XLSX Anomali",
				description: "Unggah snapshot terbaru untuk melihat rekonsiliasi sebelum diimpor.",
				ui: {
					content: "import-modal bg-[var(--color-paper)] text-[var(--color-ink-2)]",
					header: "border-b border-[var(--color-rule)] bg-[var(--color-paper)]",
					title: "text-[var(--color-ink)]",
					description: "text-[var(--color-muted)]",
					body: "bg-[var(--color-paper)] p-0",
					footer: "border-t border-[var(--color-rule)] bg-[var(--color-paper)] p-0"
				}
			}, {
				body: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="import-form" data-v-edee2a50${_scopeId}><label class="import-field" for="anomali-import-file" data-v-edee2a50${_scopeId}><span data-v-edee2a50${_scopeId}>File XLSX</span>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFileUpload, {
							id: "anomali-import-file",
							modelValue: (0, vue_exports.unref)(importFile),
							"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(importFile) ? importFile.value = $event : null,
							accept: ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
							"file-image": false,
							dropzone: false,
							ui: importFileUploadUi,
							label: "Pilih file XLSX",
							description: "File diproses sementara dan tidak disimpan."
						}, null, _parent, _scopeId));
						_push(`</label><label class="import-field" for="anomali-import-password" data-v-edee2a50${_scopeId}><span data-v-edee2a50${_scopeId}>Password import</span>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
							id: "anomali-import-password",
							modelValue: (0, vue_exports.unref)(importPassword),
							"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(importPassword) ? importPassword.value = $event : null,
							type: "password",
							autocomplete: "current-password",
							ui: importInputUi,
							placeholder: "Masukkan password"
						}, null, _parent, _scopeId));
						_push(`</label>`);
						if ((0, vue_exports.unref)(importError)) _push(`<p class="import-message import-message--error" role="alert" data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(importError))}</p>`);
						else _push(`<!---->`);
						if ((0, vue_exports.unref)(importPreview)) {
							_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([{ "import-preview--invalid": !(0, vue_exports.unref)(importPreview).valid }, "import-preview"])}" data-v-edee2a50${_scopeId}><div class="import-preview__header" data-v-edee2a50${_scopeId}><strong data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(importPreview).valid ? "Ringkasan rekonsiliasi" : "Import belum dapat dilakukan")}</strong><span data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(importPreview).valid ? "Siap diimpor" : "Perbaiki temuan berikut")}</span></div><div class="import-preview__grid" data-v-edee2a50${_scopeId}><div data-v-edee2a50${_scopeId}><strong data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatImportCount((0, vue_exports.unref)(importPreview).counts.sourceRows))}</strong><span data-v-edee2a50${_scopeId}>Baris sumber</span></div><div data-v-edee2a50${_scopeId}><strong data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatImportCount((0, vue_exports.unref)(importPreview).counts.uniqueRows))}</strong><span data-v-edee2a50${_scopeId}>Anomali unik</span></div><div data-v-edee2a50${_scopeId}><strong data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatImportCount((0, vue_exports.unref)(importPreview).counts.new))}</strong><span data-v-edee2a50${_scopeId}>Baru</span></div><div data-v-edee2a50${_scopeId}><strong data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatImportCount((0, vue_exports.unref)(importPreview).counts.existing))}</strong><span data-v-edee2a50${_scopeId}>Tetap</span></div><div data-v-edee2a50${_scopeId}><strong data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatImportCount((0, vue_exports.unref)(importPreview).counts.reappeared))}</strong><span data-v-edee2a50${_scopeId}>Muncul kembali</span></div><div data-v-edee2a50${_scopeId}><strong data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatImportCount((0, vue_exports.unref)(importPreview).counts.disappeared))}</strong><span data-v-edee2a50${_scopeId}>Hilang oleh sistem</span></div><div data-v-edee2a50${_scopeId}><strong data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatImportCount((0, vue_exports.unref)(importPreview).counts.duplicateRows))}</strong><span data-v-edee2a50${_scopeId}>Duplikat</span></div><div data-v-edee2a50${_scopeId}><strong data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatImportCount((0, vue_exports.unref)(importPreview).counts.invalidMasterSls))}</strong><span data-v-edee2a50${_scopeId}>Master SLS tidak ditemukan</span></div><div data-v-edee2a50${_scopeId}><strong data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatImportCount((0, vue_exports.unref)(importPreview).counts.invalidMasterAnomali))}</strong><span data-v-edee2a50${_scopeId}>Master Anomali tidak ditemukan</span></div><div data-v-edee2a50${_scopeId}><strong data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatImportCount((0, vue_exports.unref)(importPreview).counts.conflictingDuplicates))}</strong><span data-v-edee2a50${_scopeId}>Konflik</span></div></div>`);
							if ((0, vue_exports.unref)(importPreview).issues.length) {
								_push(`<ul class="import-preview__issues" data-v-edee2a50${_scopeId}><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(importPreview).issues.slice(0, 3), (issue) => {
									_push(`<li data-v-edee2a50${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(issue.message)}</li>`);
								});
								_push(`<!--]--></ul>`);
							} else _push(`<!---->`);
							_push(`</div>`);
						} else _push(`<!---->`);
						_push(`</div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "import-form" }, [
						(0, vue_exports.createVNode)("label", {
							class: "import-field",
							for: "anomali-import-file"
						}, [(0, vue_exports.createVNode)("span", null, "File XLSX"), (0, vue_exports.createVNode)(_component_UFileUpload, {
							id: "anomali-import-file",
							modelValue: (0, vue_exports.unref)(importFile),
							"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(importFile) ? importFile.value = $event : null,
							accept: ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
							"file-image": false,
							dropzone: false,
							ui: importFileUploadUi,
							label: "Pilih file XLSX",
							description: "File diproses sementara dan tidak disimpan."
						}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
						(0, vue_exports.createVNode)("label", {
							class: "import-field",
							for: "anomali-import-password"
						}, [(0, vue_exports.createVNode)("span", null, "Password import"), (0, vue_exports.createVNode)(_component_UInput, {
							id: "anomali-import-password",
							modelValue: (0, vue_exports.unref)(importPassword),
							"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(importPassword) ? importPassword.value = $event : null,
							type: "password",
							autocomplete: "current-password",
							ui: importInputUi,
							placeholder: "Masukkan password"
						}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
						(0, vue_exports.unref)(importError) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 0,
							class: "import-message import-message--error",
							role: "alert"
						}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(importError)), 1)) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.unref)(importPreview) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 1,
							class: ["import-preview", { "import-preview--invalid": !(0, vue_exports.unref)(importPreview).valid }]
						}, [
							(0, vue_exports.createVNode)("div", { class: "import-preview__header" }, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(importPreview).valid ? "Ringkasan rekonsiliasi" : "Import belum dapat dilakukan"), 1), (0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(importPreview).valid ? "Siap diimpor" : "Perbaiki temuan berikut"), 1)]),
							(0, vue_exports.createVNode)("div", { class: "import-preview__grid" }, [
								(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatImportCount((0, vue_exports.unref)(importPreview).counts.sourceRows)), 1), (0, vue_exports.createVNode)("span", null, "Baris sumber")]),
								(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatImportCount((0, vue_exports.unref)(importPreview).counts.uniqueRows)), 1), (0, vue_exports.createVNode)("span", null, "Anomali unik")]),
								(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatImportCount((0, vue_exports.unref)(importPreview).counts.new)), 1), (0, vue_exports.createVNode)("span", null, "Baru")]),
								(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatImportCount((0, vue_exports.unref)(importPreview).counts.existing)), 1), (0, vue_exports.createVNode)("span", null, "Tetap")]),
								(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatImportCount((0, vue_exports.unref)(importPreview).counts.reappeared)), 1), (0, vue_exports.createVNode)("span", null, "Muncul kembali")]),
								(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatImportCount((0, vue_exports.unref)(importPreview).counts.disappeared)), 1), (0, vue_exports.createVNode)("span", null, "Hilang oleh sistem")]),
								(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatImportCount((0, vue_exports.unref)(importPreview).counts.duplicateRows)), 1), (0, vue_exports.createVNode)("span", null, "Duplikat")]),
								(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatImportCount((0, vue_exports.unref)(importPreview).counts.invalidMasterSls)), 1), (0, vue_exports.createVNode)("span", null, "Master SLS tidak ditemukan")]),
								(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatImportCount((0, vue_exports.unref)(importPreview).counts.invalidMasterAnomali)), 1), (0, vue_exports.createVNode)("span", null, "Master Anomali tidak ditemukan")]),
								(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatImportCount((0, vue_exports.unref)(importPreview).counts.conflictingDuplicates)), 1), (0, vue_exports.createVNode)("span", null, "Konflik")])
							]),
							(0, vue_exports.unref)(importPreview).issues.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("ul", {
								key: 0,
								class: "import-preview__issues"
							}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)((0, vue_exports.unref)(importPreview).issues.slice(0, 3), (issue) => {
								return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("li", { key: issue.code }, (0, vue_exports.toDisplayString)(issue.message), 1);
							}), 128))])) : (0, vue_exports.createCommentVNode)("", true)
						], 2)) : (0, vue_exports.createCommentVNode)("", true)
					])];
				}),
				footer: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="import-actions" data-v-edee2a50${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
							label: "Batal",
							color: "neutral",
							variant: "ghost",
							disabled: (0, vue_exports.unref)(previewingImport) || (0, vue_exports.unref)(applyingImport),
							onClick: closeImportModal
						}, null, _parent, _scopeId));
						if ((0, vue_exports.unref)(importPreview)?.valid) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
							label: "Import Data",
							icon: "i-lucide-upload",
							loading: (0, vue_exports.unref)(applyingImport),
							disabled: (0, vue_exports.unref)(previewingImport),
							onClick: applyImport
						}, null, _parent, _scopeId));
						else _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
							label: "Preview Import",
							icon: "i-lucide-file-search",
							loading: (0, vue_exports.unref)(previewingImport),
							disabled: (0, vue_exports.unref)(applyingImport),
							onClick: previewImport
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "import-actions" }, [(0, vue_exports.createVNode)(_component_UButton, {
						label: "Batal",
						color: "neutral",
						variant: "ghost",
						disabled: (0, vue_exports.unref)(previewingImport) || (0, vue_exports.unref)(applyingImport),
						onClick: closeImportModal
					}, null, 8, ["disabled"]), (0, vue_exports.unref)(importPreview)?.valid ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UButton, {
						key: 0,
						label: "Import Data",
						icon: "i-lucide-upload",
						loading: (0, vue_exports.unref)(applyingImport),
						disabled: (0, vue_exports.unref)(previewingImport),
						onClick: applyImport
					}, null, 8, ["loading", "disabled"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UButton, {
						key: 1,
						label: "Preview Import",
						icon: "i-lucide-file-search",
						loading: (0, vue_exports.unref)(previewingImport),
						disabled: (0, vue_exports.unref)(applyingImport),
						onClick: previewImport
					}, null, 8, ["loading", "disabled"]))])];
				}),
				_: 1
			}, _parent));
			_push(`</main>`);
		};
	}
});
//#endregion
//#region app/pages/anomali.vue
var _sfc_setup = anomali_vue_vue_type_script_setup_true_lang_default.setup;
anomali_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/anomali.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var anomali_default = /*#__PURE__*/ _plugin_vue_export_helper_default(anomali_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-edee2a50"]]);

export { anomali_default as default };
//# sourceMappingURL=anomali-DK0TSzTz.mjs.map
