import { _ as _plugin_vue_export_helper_default, v as vue_exports, u as useToast, s as server_renderer_exports, a as _sfc_main, $ as $fetch$2 } from '../virtual/entry.mjs';
import { u as useFetch, A as AppNavbar_default, _ as _sfc_main$1, a as _sfc_main$3 } from './fetch-DCvyPg_e.mjs';
import { _ as _sfc_main$4 } from './Badge-C_GhtgSf.mjs';
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

//#region app/components/tidak-ditemukan/TidakDitemukanFilterBar.vue?vue&type=script&setup=true&lang.ts
var TidakDitemukanFilterBar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "TidakDitemukanFilterBar",
	__ssrInlineRender: true,
	props: {
		filters: {},
		search: {}
	},
	emits: ["update:filters", "update:search"],
	async setup(__props, { emit: __emit }) {
		let __temp, __restore;
		const lightInputUi = {
			base: "bg-[var(--color-paper)] text-[var(--color-ink-2)] placeholder:text-[var(--color-muted)] ring-[var(--color-rule-2)]",
			leadingIcon: "text-[var(--color-muted)]"
		};
		const props = __props;
		const emit = __emit;
		const optionsQuery = (0, vue_exports.computed)(() => ({
			kecamatan: props.filters.kecamatan || void 0,
			desa: props.filters.desa || void 0,
			namaSls: props.filters.namaSls || void 0,
			ppl: props.filters.ppl || void 0,
			pml: props.filters.pml || void 0
		}));
		const { data: options } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useFetch("/api/tidak-ditemukan/filter-options", { query: optionsQuery }, "$JDhELPS2s2")), __temp = await __temp, __restore(), __temp);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UInput = _sfc_main$3;
			_push(`<section${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({
				class: "filters",
				"aria-label": "Filter Tidak Ditemukan"
			}, _attrs))} data-v-048f3cfd>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
				"model-value": __props.search,
				icon: "i-lucide-search",
				placeholder: "Cari assignment, SLS, wilayah, PPL, PML...",
				color: "neutral",
				variant: "outline",
				class: "filters__search",
				ui: lightInputUi,
				"onUpdate:modelValue": ($event) => emit("update:search", String($event ?? ""))
			}, null, _parent));
			_push(`<select${(0, server_renderer_exports.ssrRenderAttr)("value", __props.filters.completionStatus)} aria-label="Status" data-v-048f3cfd><option value="" data-v-048f3cfd> Semua status </option><option value="unresolved" data-v-048f3cfd> Belum selesai </option><option value="completed" data-v-048f3cfd> Selesai </option></select><select${(0, server_renderer_exports.ssrRenderAttr)("value", __props.filters.kecamatan)} aria-label="Kecamatan" data-v-048f3cfd><option value="" data-v-048f3cfd> Semua kecamatan </option><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(options)?.kecamatan, (item) => {
				_push(`<option${(0, server_renderer_exports.ssrRenderAttr)("value", item)} data-v-048f3cfd>${(0, server_renderer_exports.ssrInterpolate)(item)}</option>`);
			});
			_push(`<!--]--></select><select${(0, server_renderer_exports.ssrRenderAttr)("value", __props.filters.desa)}${(0, server_renderer_exports.ssrIncludeBooleanAttr)(!__props.filters.kecamatan) ? " disabled" : ""} aria-label="Desa" data-v-048f3cfd><option value="" data-v-048f3cfd> Semua desa </option><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(options)?.desa, (item) => {
				_push(`<option${(0, server_renderer_exports.ssrRenderAttr)("value", item)} data-v-048f3cfd>${(0, server_renderer_exports.ssrInterpolate)(item)}</option>`);
			});
			_push(`<!--]--></select><select${(0, server_renderer_exports.ssrRenderAttr)("value", __props.filters.namaSls)}${(0, server_renderer_exports.ssrIncludeBooleanAttr)(!__props.filters.desa) ? " disabled" : ""} aria-label="SLS" data-v-048f3cfd><option value="" data-v-048f3cfd> Semua SLS </option><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(options)?.namaSls, (item) => {
				_push(`<option${(0, server_renderer_exports.ssrRenderAttr)("value", item)} data-v-048f3cfd>${(0, server_renderer_exports.ssrInterpolate)(item)}</option>`);
			});
			_push(`<!--]--></select><select${(0, server_renderer_exports.ssrRenderAttr)("value", __props.filters.ppl)} aria-label="PPL" data-v-048f3cfd><option value="" data-v-048f3cfd> Semua PPL </option><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(options)?.ppl, (item) => {
				_push(`<option${(0, server_renderer_exports.ssrRenderAttr)("value", item)} data-v-048f3cfd>${(0, server_renderer_exports.ssrInterpolate)(item)}</option>`);
			});
			_push(`<!--]--></select><select${(0, server_renderer_exports.ssrRenderAttr)("value", __props.filters.pml)} aria-label="PML" data-v-048f3cfd><option value="" data-v-048f3cfd> Semua PML </option><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(options)?.pml, (item) => {
				_push(`<option${(0, server_renderer_exports.ssrRenderAttr)("value", item)} data-v-048f3cfd>${(0, server_renderer_exports.ssrInterpolate)(item)}</option>`);
			});
			_push(`<!--]--></select></section>`);
		};
	}
});
//#endregion
//#region app/components/tidak-ditemukan/TidakDitemukanFilterBar.vue
var _sfc_setup$2 = TidakDitemukanFilterBar_vue_vue_type_script_setup_true_lang_default.setup;
TidakDitemukanFilterBar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tidak-ditemukan/TidakDitemukanFilterBar.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var TidakDitemukanFilterBar_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(TidakDitemukanFilterBar_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-048f3cfd"]]), { __name: "TidakDitemukanFilterBar" });
//#endregion
//#region app/components/tidak-ditemukan/TidakDitemukanSlsGroup.vue?vue&type=script&setup=true&lang.ts
var TidakDitemukanSlsGroup_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "TidakDitemukanSlsGroup",
	__ssrInlineRender: true,
	props: {
		group: {},
		expanded: { type: Boolean },
		saving: { type: Boolean }
	},
	emits: ["toggle", "update-status"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const detailsId = (0, vue_exports.computed)(() => `tidak-ditemukan-${encodeURIComponent(props.group.idSubsls)}`);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = _sfc_main;
			const _component_UBadge = _sfc_main$4;
			_push(`<!--[--><tr class="sls-row" data-v-bb3812b3><td data-v-bb3812b3>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				color: "neutral",
				variant: "ghost",
				size: "sm",
				icon: __props.expanded ? "i-lucide-chevron-down" : "i-lucide-chevron-right",
				"aria-controls": (0, vue_exports.unref)(detailsId),
				"aria-expanded": __props.expanded,
				onClick: ($event) => emit("toggle")
			}, null, _parent));
			_push(`</td><td data-v-bb3812b3><strong data-v-bb3812b3>${(0, server_renderer_exports.ssrInterpolate)(__props.group.wilayah.namaSls)}</strong><span data-v-bb3812b3>${(0, server_renderer_exports.ssrInterpolate)(__props.group.idSubsls)}</span></td><td data-v-bb3812b3><strong data-v-bb3812b3>${(0, server_renderer_exports.ssrInterpolate)(__props.group.wilayah.kecamatan)}</strong><span data-v-bb3812b3>${(0, server_renderer_exports.ssrInterpolate)(__props.group.wilayah.desa)}</span></td><td data-v-bb3812b3>${(0, server_renderer_exports.ssrInterpolate)(__props.group.wilayah.ppl)}</td><td data-v-bb3812b3>${(0, server_renderer_exports.ssrInterpolate)(__props.group.wilayah.pml)}</td><td data-v-bb3812b3>${(0, server_renderer_exports.ssrInterpolate)(__props.group.assignments.length)}</td><td data-v-bb3812b3>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
				color: __props.group.isSelesai ? "success" : "error",
				variant: "solid"
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(__props.group.isSelesai ? "Selesai" : "Belum selesai")}`);
					else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.group.isSelesai ? "Selesai" : "Belum selesai"), 1)];
				}),
				_: 1
			}, _parent));
			_push(`</td><td class="sls-row__actions" data-v-bb3812b3><a${(0, server_renderer_exports.ssrRenderAttr)("href", `/api/tidak-ditemukan/${encodeURIComponent(__props.group.idSubsls)}/docx`)} class="download-docx" data-v-bb3812b3>Download DOCX</a>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				label: __props.group.isSelesai ? "Batalkan" : "Tandai selesai",
				color: __props.group.isSelesai ? "neutral" : "success",
				size: "xs",
				loading: __props.saving,
				onClick: ($event) => emit("update-status", !__props.group.isSelesai)
			}, null, _parent));
			_push(`</td></tr>`);
			if (__props.expanded) {
				_push(`<tr class="sls-detail-row" data-v-bb3812b3><td${(0, server_renderer_exports.ssrRenderAttr)("colspan", 8)} data-v-bb3812b3><div${(0, server_renderer_exports.ssrRenderAttr)("id", (0, vue_exports.unref)(detailsId))} class="sls-detail" data-v-bb3812b3><table data-v-bb3812b3><thead data-v-bb3812b3><tr data-v-bb3812b3><th data-v-bb3812b3>No.</th><th data-v-bb3812b3>Nama Assignment</th><th data-v-bb3812b3>Sumber</th></tr></thead><tbody data-v-bb3812b3><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(__props.group.assignments, (assignment, index) => {
					_push(`<tr data-v-bb3812b3><td data-v-bb3812b3>${(0, server_renderer_exports.ssrInterpolate)(index + 1)}</td><td data-v-bb3812b3>${(0, server_renderer_exports.ssrInterpolate)(assignment.namaAssignment)}</td><td data-v-bb3812b3>${(0, server_renderer_exports.ssrInterpolate)(assignment.sumber || "-")}</td></tr>`);
				});
				_push(`<!--]--></tbody></table></div></td></tr>`);
			} else _push(`<!---->`);
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region app/components/tidak-ditemukan/TidakDitemukanSlsGroup.vue
var _sfc_setup$1 = TidakDitemukanSlsGroup_vue_vue_type_script_setup_true_lang_default.setup;
TidakDitemukanSlsGroup_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tidak-ditemukan/TidakDitemukanSlsGroup.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var TidakDitemukanSlsGroup_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(TidakDitemukanSlsGroup_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-bb3812b3"]]), { __name: "TidakDitemukanSlsGroup" });
//#endregion
//#region app/pages/tidak-ditemukan.vue?vue&type=script&setup=true&lang.ts
var PAGE_SIZE = 20;
var tidak_ditemukan_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "tidak-ditemukan",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const filters = (0, vue_exports.reactive)({
			kecamatan: "",
			desa: "",
			namaSls: "",
			ppl: "",
			pml: "",
			completionStatus: ""
		});
		const searchInput = (0, vue_exports.ref)("");
		const committedSearch = (0, vue_exports.ref)("");
		const page = (0, vue_exports.ref)(1);
		const expanded = (0, vue_exports.reactive)({});
		const saving = (0, vue_exports.reactive)({});
		const mutationError = (0, vue_exports.ref)("");
		const downloadingVisibleZip = (0, vue_exports.ref)(false);
		const downloadingFilteredZip = (0, vue_exports.ref)(false);
		const importModalOpen = (0, vue_exports.ref)(false);
		const importFile = (0, vue_exports.ref)(null);
		const importPassword = (0, vue_exports.ref)("");
		const importPreview = (0, vue_exports.ref)(null);
		const importError = (0, vue_exports.ref)("");
		const previewingImport = (0, vue_exports.ref)(false);
		const applyingImport = (0, vue_exports.ref)(false);
		const importConfirmed = (0, vue_exports.ref)(false);
		const filterBarKey = (0, vue_exports.ref)(0);
		const toast = useToast();
		const importFileUploadUi = {
			base: "bg-[var(--color-paper)] border-[var(--color-rule-2)] text-[var(--color-ink-2)] hover:bg-[var(--color-paper-2)]",
			icon: "text-[var(--color-accent)]",
			label: "text-[var(--color-ink)]",
			description: "text-[var(--color-muted)]"
		};
		const importInputUi = { base: "bg-[var(--color-paper)] text-[var(--color-ink-2)] placeholder:text-[var(--color-muted)] ring-[var(--color-rule-2)]" };
		const listQuery = (0, vue_exports.computed)(() => ({
			page: page.value,
			pageSize: PAGE_SIZE,
			search: committedSearch.value || void 0,
			kecamatan: filters.kecamatan || void 0,
			desa: filters.desa || void 0,
			namaSls: filters.namaSls || void 0,
			ppl: filters.ppl || void 0,
			pml: filters.pml || void 0,
			completionStatus: filters.completionStatus || void 0
		}));
		const { data: list, status: listStatus, error: listError, refresh: refreshList } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useFetch("/api/tidak-ditemukan", { query: listQuery }, "$G_xmuxt6FU")), __temp = await __temp, __restore(), __temp);
		const { data: snapshot, refresh: refreshSnapshot } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useFetch("/api/tidak-ditemukan/snapshot", "$wSHERrBQe8")), __temp = await __temp, __restore(), __temp);
		let searchTimer;
		(0, vue_exports.watch)(searchInput, (value) => {
			if (searchTimer) clearTimeout(searchTimer);
			searchTimer = setTimeout(() => {
				committedSearch.value = value.trim();
				page.value = 1;
			}, 280);
		});
		(0, vue_exports.watch)(filters, () => {
			page.value = 1;
		}, { deep: true });
		(0, vue_exports.watch)(importFile, () => {
			importPreview.value = null;
			importError.value = "";
			importConfirmed.value = false;
			importPassword.value = "";
		});
		const isLoading = (0, vue_exports.computed)(() => listStatus.value === "pending");
		const hasGroups = (0, vue_exports.computed)(() => (list.value?.groups.length ?? 0) > 0);
		const rangeStart = (0, vue_exports.computed)(() => list.value?.totalSls ? (list.value.page - 1) * list.value.pageSize + 1 : 0);
		const rangeEnd = (0, vue_exports.computed)(() => list.value ? Math.min(list.value.page * list.value.pageSize, list.value.totalSls) : 0);
		function updateFilters(next) {
			Object.assign(filters, next);
		}
		function formatCount(value) {
			return new Intl.NumberFormat("id-ID").format(value);
		}
		function formattedImportDate(value) {
			return new Intl.DateTimeFormat("id-ID", {
				dateStyle: "long",
				timeStyle: "short"
			}).format(new Date(value));
		}
		function resetImportForm() {
			importFile.value = null;
			importPassword.value = "";
			importPreview.value = null;
			importError.value = "";
			importConfirmed.value = false;
		}
		function openImportModal() {
			resetImportForm();
			importModalOpen.value = true;
		}
		function closeImportModal() {
			importModalOpen.value = false;
			resetImportForm();
		}
		function onImportModalUpdate(isOpen) {
			if (!isOpen) resetImportForm();
		}
		function createImportFormData(includePassword = false) {
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
			if (includePassword) formData.append("password", importPassword.value);
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
				importPreview.value = await $fetch$2("/api/tidak-ditemukan/import/preview", {
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
			const formData = createImportFormData(true);
			if (!formData || !importPreview.value?.valid || !importConfirmed.value || !importPassword.value || applyingImport.value) return;
			importError.value = "";
			applyingImport.value = true;
			try {
				const result = await $fetch$2("/api/tidak-ditemukan/import/apply", {
					method: "POST",
					body: formData
				});
				if (!result.valid || !result.applied) {
					importPreview.value = result;
					return;
				}
				page.value = 1;
				filterBarKey.value++;
				await Promise.all([refreshList(), refreshSnapshot()]);
				toast.add({
					title: "Import Tidak Ditemukan berhasil",
					description: `${formatCount(result.counts.jumlahAssignment)} assignment pada ${formatCount(result.counts.jumlahSls)} SLS telah diganti.`,
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
		async function updateStatus(group, isSelesai) {
			if (saving[group.idSubsls]) return;
			saving[group.idSubsls] = true;
			mutationError.value = "";
			const previous = {
				isSelesai: group.isSelesai,
				selesaiAt: group.selesaiAt
			};
			group.isSelesai = isSelesai;
			group.selesaiAt = isSelesai ? (/* @__PURE__ */ new Date()).toISOString() : null;
			try {
				const response = await $fetch$2(`/api/tidak-ditemukan/${encodeURIComponent(group.idSubsls)}/status`, {
					method: "PATCH",
					body: { isSelesai }
				});
				group.isSelesai = response.isSelesai;
				group.selesaiAt = response.selesaiAt;
			} catch {
				group.isSelesai = previous.isSelesai;
				group.selesaiAt = previous.selesaiAt;
				mutationError.value = "Status SLS gagal diperbarui. Perubahan lokal dikembalikan.";
			} finally {
				saving[group.idSubsls] = false;
			}
		}
		async function requestDocxZip(endpoint, body, fallbackFilename) {
			const response = await fetch(endpoint, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(body)
			});
			if (!response.ok) {
				const errorBody = await response.json().catch(() => null);
				throw new Error(errorBody?.statusMessage ?? errorBody?.message ?? "ZIP download failed.");
			}
			const filename = response.headers.get("content-disposition")?.match(/filename="([^"]+)"/i)?.[1] ?? fallbackFilename;
			const downloadUrl = URL.createObjectURL(await response.blob());
			const link = (void 0).createElement("a");
			link.href = downloadUrl;
			link.download = filename;
			(void 0).body.append(link);
			link.click();
			link.remove();
			setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
		}
		async function downloadVisibleDocxZip() {
			const idSubsls = list.value?.groups.map((group) => group.idSubsls) ?? [];
			if (idSubsls.length === 0 || downloadingVisibleZip.value || downloadingFilteredZip.value) return;
			downloadingVisibleZip.value = true;
			mutationError.value = "";
			try {
				await requestDocxZip("/api/tidak-ditemukan/docx-zip", { idSubsls }, `Tidak Ditemukan - ${idSubsls.length} SLS.zip`);
			} catch (error) {
				mutationError.value = error instanceof Error ? error.message : "ZIP DOCX gagal dibuat. Tidak ada status SLS yang diubah.";
			} finally {
				downloadingVisibleZip.value = false;
			}
		}
		async function downloadFilteredDocxZip() {
			if (!list.value?.totalSls || downloadingVisibleZip.value || downloadingFilteredZip.value) return;
			downloadingFilteredZip.value = true;
			mutationError.value = "";
			try {
				await requestDocxZip("/api/tidak-ditemukan/docx-zip/filter", {
					search: committedSearch.value || void 0,
					status: filters.completionStatus || void 0,
					kecamatan: filters.kecamatan || void 0,
					desa: filters.desa || void 0,
					sls: filters.namaSls || void 0,
					ppl: filters.ppl || void 0,
					pml: filters.pml || void 0
				}, `Tidak Ditemukan - ${list.value.totalSls} SLS.zip`);
			} catch (error) {
				mutationError.value = error instanceof Error ? error.message : "ZIP DOCX gagal dibuat. Tidak ada status SLS yang diubah.";
			} finally {
				downloadingFilteredZip.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AppNavbar = AppNavbar_default;
			const _component_UButton = _sfc_main;
			const _component_USkeleton = _sfc_main$1;
			const _component_UModal = _sfc_main$1$1;
			const _component_UFileUpload = _sfc_main$2;
			const _component_UInput = _sfc_main$3;
			_push(`<main${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "tidak-ditemukan-page" }, _attrs))} data-v-6a599a3e>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_AppNavbar, null, {
				actions: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
						label: "Import Data",
						icon: "i-lucide-upload",
						color: "neutral",
						variant: "outline",
						size: "sm",
						onClick: openImportModal
					}, null, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UButton, {
						label: "Import Data",
						icon: "i-lucide-upload",
						color: "neutral",
						variant: "outline",
						size: "sm",
						onClick: openImportModal
					})];
				}),
				_: 1
			}, _parent));
			_push(`<section class="page-heading" data-v-6a599a3e><div data-v-6a599a3e><h1 data-v-6a599a3e>Tidak Ditemukan</h1><p data-v-6a599a3e> Satu baris untuk satu SLS. Buka detail untuk melihat seluruh assignment tidak ditemukan. </p></div>`);
			if ((0, vue_exports.unref)(snapshot)) {
				_push(`<p class="snapshot" data-v-6a599a3e> Data per ${(0, server_renderer_exports.ssrInterpolate)(formattedImportDate((0, vue_exports.unref)(snapshot).importedAt))} · ${(0, server_renderer_exports.ssrInterpolate)(formatCount((0, vue_exports.unref)(snapshot).jumlahAssignment))} assignment · ${(0, server_renderer_exports.ssrInterpolate)(formatCount((0, vue_exports.unref)(snapshot).jumlahSls))} SLS `);
				if ((0, vue_exports.unref)(snapshot).namaFile) _push(`<span data-v-6a599a3e>· ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(snapshot).namaFile)}</span>`);
				else _push(`<!---->`);
				_push(`</p>`);
			} else _push(`<!---->`);
			_push(`</section>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(TidakDitemukanFilterBar_default, {
				key: (0, vue_exports.unref)(filterBarKey),
				filters: (0, vue_exports.unref)(filters),
				search: (0, vue_exports.unref)(searchInput),
				"onUpdate:filters": updateFilters,
				"onUpdate:search": ($event) => searchInput.value = $event
			}, null, _parent));
			if ((0, vue_exports.unref)(mutationError)) _push(`<p class="mutation-error" role="alert" data-v-6a599a3e>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(mutationError))}</p>`);
			else _push(`<!---->`);
			_push(`<section class="results"${(0, server_renderer_exports.ssrRenderAttr)("aria-busy", (0, vue_exports.unref)(isLoading))} data-v-6a599a3e>`);
			if ((0, vue_exports.unref)(list)) {
				_push(`<div class="results-toolbar" data-v-6a599a3e><p class="result-count" data-v-6a599a3e> Menampilkan ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(rangeStart))}–${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(rangeEnd))} dari ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(list).totalSls)} SLS </p><div class="results-actions" data-v-6a599a3e>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Download Halaman Ini (ZIP)",
					icon: "i-lucide-download",
					color: "neutral",
					variant: "outline",
					size: "xs",
					disabled: !(0, vue_exports.unref)(hasGroups) || (0, vue_exports.unref)(downloadingFilteredZip),
					loading: (0, vue_exports.unref)(downloadingVisibleZip),
					onClick: downloadVisibleDocxZip
				}, null, _parent));
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Download Semua Hasil Filter (ZIP)",
					icon: "i-lucide-download",
					color: "neutral",
					variant: "outline",
					size: "xs",
					disabled: !(0, vue_exports.unref)(list).totalSls || (0, vue_exports.unref)(downloadingVisibleZip),
					loading: (0, vue_exports.unref)(downloadingFilteredZip),
					onClick: downloadFilteredDocxZip
				}, null, _parent));
				_push(`</div></div>`);
			} else _push(`<!---->`);
			if ((0, vue_exports.unref)(listError)) _push(`<div class="empty-state" role="alert" data-v-6a599a3e> Data Tidak Ditemukan tidak dapat dimuat. </div>`);
			else if (!(0, vue_exports.unref)(hasGroups) && !(0, vue_exports.unref)(isLoading)) _push(`<div class="empty-state" data-v-6a599a3e> Tidak ada SLS yang cocok dengan filter. </div>`);
			else {
				_push(`<div class="table-scroll" data-v-6a599a3e><table class="sls-table" data-v-6a599a3e><thead data-v-6a599a3e><tr data-v-6a599a3e><th data-v-6a599a3e></th><th data-v-6a599a3e>SLS</th><th data-v-6a599a3e>Wilayah</th><th data-v-6a599a3e>PPL</th><th data-v-6a599a3e>PML</th><th data-v-6a599a3e>Jumlah Assignment</th><th data-v-6a599a3e>Status</th><th data-v-6a599a3e>Aksi</th></tr></thead><tbody data-v-6a599a3e>`);
				if ((0, vue_exports.unref)(isLoading)) {
					_push(`<tr data-v-6a599a3e><td colspan="8" class="loading-cell" data-v-6a599a3e>`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "loading-cell__line" }, null, _parent));
					_push(`</td></tr>`);
				} else {
					_push(`<!--[-->`);
					(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(list)?.groups, (group) => {
						_push((0, server_renderer_exports.ssrRenderComponent)(TidakDitemukanSlsGroup_default, {
							key: group.idSubsls,
							group,
							expanded: Boolean((0, vue_exports.unref)(expanded)[group.idSubsls]),
							saving: Boolean((0, vue_exports.unref)(saving)[group.idSubsls]),
							onToggle: ($event) => (0, vue_exports.unref)(expanded)[group.idSubsls] = !(0, vue_exports.unref)(expanded)[group.idSubsls],
							onUpdateStatus: ($event) => updateStatus(group, $event)
						}, null, _parent));
					});
					_push(`<!--]-->`);
				}
				_push(`</tbody></table></div>`);
			}
			if ((0, vue_exports.unref)(list) && (0, vue_exports.unref)(list).totalPages > 1) {
				_push(`<nav class="pagination" aria-label="Halaman SLS" data-v-6a599a3e>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Sebelumnya",
					color: "neutral",
					variant: "outline",
					disabled: (0, vue_exports.unref)(list).page === 1,
					onClick: ($event) => page.value = (0, vue_exports.unref)(list).page - 1
				}, null, _parent));
				_push(`<span data-v-6a599a3e>Halaman ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(list).page)} / ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(list).totalPages)}</span>`);
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
				title: "Import XLSX Tidak Ditemukan",
				description: "Validasi snapshot sebelum mengganti data Tidak Ditemukan saat ini.",
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
						_push(`<div class="import-form" data-v-6a599a3e${_scopeId}><label class="import-field" for="tidak-ditemukan-import-file" data-v-6a599a3e${_scopeId}><span data-v-6a599a3e${_scopeId}>File XLSX</span>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFileUpload, {
							id: "tidak-ditemukan-import-file",
							modelValue: (0, vue_exports.unref)(importFile),
							"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(importFile) ? importFile.value = $event : null,
							accept: ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
							"file-image": false,
							dropzone: false,
							ui: importFileUploadUi,
							label: "Pilih file XLSX",
							description: "File diproses sementara dan tidak disimpan."
						}, null, _parent, _scopeId));
						_push(`</label>`);
						if ((0, vue_exports.unref)(importError)) _push(`<p class="import-message import-message--error" role="alert" data-v-6a599a3e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(importError))}</p>`);
						else _push(`<!---->`);
						if ((0, vue_exports.unref)(importPreview)) {
							_push(`<!--[--><div class="${(0, server_renderer_exports.ssrRenderClass)([{ "import-preview--invalid": !(0, vue_exports.unref)(importPreview).valid }, "import-preview"])}" data-v-6a599a3e${_scopeId}><div class="import-preview__header" data-v-6a599a3e${_scopeId}><strong data-v-6a599a3e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(importPreview).valid ? "Ringkasan validasi" : "Import belum dapat dilakukan")}</strong><span data-v-6a599a3e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(importPreview).fileName)}</span></div><div class="import-preview__grid" data-v-6a599a3e${_scopeId}><div data-v-6a599a3e${_scopeId}><strong data-v-6a599a3e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatCount((0, vue_exports.unref)(importPreview).counts.sourceRows))}</strong><span data-v-6a599a3e${_scopeId}>Baris sumber</span></div><div data-v-6a599a3e${_scopeId}><strong data-v-6a599a3e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatCount((0, vue_exports.unref)(importPreview).counts.jumlahAssignment))}</strong><span data-v-6a599a3e${_scopeId}>Assignment valid</span></div><div data-v-6a599a3e${_scopeId}><strong data-v-6a599a3e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatCount((0, vue_exports.unref)(importPreview).counts.jumlahSls))}</strong><span data-v-6a599a3e${_scopeId}>SLS</span></div><div data-v-6a599a3e${_scopeId}><strong data-v-6a599a3e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatCount((0, vue_exports.unref)(importPreview).counts.invalidRows))}</strong><span data-v-6a599a3e${_scopeId}>Baris tidak valid</span></div><div data-v-6a599a3e${_scopeId}><strong data-v-6a599a3e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatCount((0, vue_exports.unref)(importPreview).counts.invalidMasterSls))}</strong><span data-v-6a599a3e${_scopeId}>Master SLS tidak ditemukan</span></div></div>`);
							if ((0, vue_exports.unref)(importPreview).issues.length) {
								_push(`<ul class="import-preview__issues" data-v-6a599a3e${_scopeId}><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(importPreview).issues.slice(0, 5), (issue) => {
									_push(`<li data-v-6a599a3e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(issue.message)}</li>`);
								});
								_push(`<!--]--></ul>`);
							} else _push(`<!---->`);
							_push(`</div>`);
							if ((0, vue_exports.unref)(importPreview).valid) _push(`<label class="import-confirmation" data-v-6a599a3e${_scopeId}><input${(0, server_renderer_exports.ssrIncludeBooleanAttr)(Array.isArray((0, vue_exports.unref)(importConfirmed)) ? (0, server_renderer_exports.ssrLooseContain)((0, vue_exports.unref)(importConfirmed), null) : (0, vue_exports.unref)(importConfirmed)) ? " checked" : ""} type="checkbox" data-v-6a599a3e${_scopeId}><span data-v-6a599a3e${_scopeId}>Saya memahami bahwa data dan seluruh status SLS saat ini akan diganti.</span></label>`);
							else _push(`<!---->`);
							if ((0, vue_exports.unref)(importPreview).valid) {
								_push(`<label class="import-field" for="tidak-ditemukan-import-password" data-v-6a599a3e${_scopeId}><span data-v-6a599a3e${_scopeId}>Password import</span>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
									id: "tidak-ditemukan-import-password",
									modelValue: (0, vue_exports.unref)(importPassword),
									"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(importPassword) ? importPassword.value = $event : null,
									type: "password",
									autocomplete: "current-password",
									ui: importInputUi,
									placeholder: "Masukkan password"
								}, null, _parent, _scopeId));
								_push(`</label>`);
							} else _push(`<!---->`);
							_push(`<!--]-->`);
						} else _push(`<!---->`);
						_push(`</div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "import-form" }, [
						(0, vue_exports.createVNode)("label", {
							class: "import-field",
							for: "tidak-ditemukan-import-file"
						}, [(0, vue_exports.createVNode)("span", null, "File XLSX"), (0, vue_exports.createVNode)(_component_UFileUpload, {
							id: "tidak-ditemukan-import-file",
							modelValue: (0, vue_exports.unref)(importFile),
							"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(importFile) ? importFile.value = $event : null,
							accept: ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
							"file-image": false,
							dropzone: false,
							ui: importFileUploadUi,
							label: "Pilih file XLSX",
							description: "File diproses sementara dan tidak disimpan."
						}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
						(0, vue_exports.unref)(importError) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 0,
							class: "import-message import-message--error",
							role: "alert"
						}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(importError)), 1)) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.unref)(importPreview) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [
							(0, vue_exports.createVNode)("div", { class: ["import-preview", { "import-preview--invalid": !(0, vue_exports.unref)(importPreview).valid }] }, [
								(0, vue_exports.createVNode)("div", { class: "import-preview__header" }, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(importPreview).valid ? "Ringkasan validasi" : "Import belum dapat dilakukan"), 1), (0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(importPreview).fileName), 1)]),
								(0, vue_exports.createVNode)("div", { class: "import-preview__grid" }, [
									(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatCount((0, vue_exports.unref)(importPreview).counts.sourceRows)), 1), (0, vue_exports.createVNode)("span", null, "Baris sumber")]),
									(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatCount((0, vue_exports.unref)(importPreview).counts.jumlahAssignment)), 1), (0, vue_exports.createVNode)("span", null, "Assignment valid")]),
									(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatCount((0, vue_exports.unref)(importPreview).counts.jumlahSls)), 1), (0, vue_exports.createVNode)("span", null, "SLS")]),
									(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatCount((0, vue_exports.unref)(importPreview).counts.invalidRows)), 1), (0, vue_exports.createVNode)("span", null, "Baris tidak valid")]),
									(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(formatCount((0, vue_exports.unref)(importPreview).counts.invalidMasterSls)), 1), (0, vue_exports.createVNode)("span", null, "Master SLS tidak ditemukan")])
								]),
								(0, vue_exports.unref)(importPreview).issues.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("ul", {
									key: 0,
									class: "import-preview__issues"
								}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)((0, vue_exports.unref)(importPreview).issues.slice(0, 5), (issue) => {
									return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("li", { key: `${issue.code}-${issue.message}` }, (0, vue_exports.toDisplayString)(issue.message), 1);
								}), 128))])) : (0, vue_exports.createCommentVNode)("", true)
							], 2),
							(0, vue_exports.unref)(importPreview).valid ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("label", {
								key: 0,
								class: "import-confirmation"
							}, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
								"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(importConfirmed) ? importConfirmed.value = $event : null,
								type: "checkbox"
							}, null, 8, ["onUpdate:modelValue"]), [[vue_exports.vModelCheckbox, (0, vue_exports.unref)(importConfirmed)]]), (0, vue_exports.createVNode)("span", null, "Saya memahami bahwa data dan seluruh status SLS saat ini akan diganti.")])) : (0, vue_exports.createCommentVNode)("", true),
							(0, vue_exports.unref)(importPreview).valid ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("label", {
								key: 1,
								class: "import-field",
								for: "tidak-ditemukan-import-password"
							}, [(0, vue_exports.createVNode)("span", null, "Password import"), (0, vue_exports.createVNode)(_component_UInput, {
								id: "tidak-ditemukan-import-password",
								modelValue: (0, vue_exports.unref)(importPassword),
								"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(importPassword) ? importPassword.value = $event : null,
								type: "password",
								autocomplete: "current-password",
								ui: importInputUi,
								placeholder: "Masukkan password"
							}, null, 8, ["modelValue", "onUpdate:modelValue"])])) : (0, vue_exports.createCommentVNode)("", true)
						], 64)) : (0, vue_exports.createCommentVNode)("", true)
					])];
				}),
				footer: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="import-actions" data-v-6a599a3e${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
							label: "Batal",
							color: "neutral",
							variant: "ghost",
							disabled: (0, vue_exports.unref)(previewingImport) || (0, vue_exports.unref)(applyingImport),
							onClick: closeImportModal
						}, null, _parent, _scopeId));
						if ((0, vue_exports.unref)(importPreview)?.valid) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
							label: "Terapkan & Ganti Data",
							icon: "i-lucide-upload",
							color: "error",
							loading: (0, vue_exports.unref)(applyingImport),
							disabled: (0, vue_exports.unref)(previewingImport) || !(0, vue_exports.unref)(importConfirmed) || !(0, vue_exports.unref)(importPassword),
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
						label: "Terapkan & Ganti Data",
						icon: "i-lucide-upload",
						color: "error",
						loading: (0, vue_exports.unref)(applyingImport),
						disabled: (0, vue_exports.unref)(previewingImport) || !(0, vue_exports.unref)(importConfirmed) || !(0, vue_exports.unref)(importPassword),
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
//#region app/pages/tidak-ditemukan.vue
var _sfc_setup = tidak_ditemukan_vue_vue_type_script_setup_true_lang_default.setup;
tidak_ditemukan_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tidak-ditemukan.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var tidak_ditemukan_default = /*#__PURE__*/ _plugin_vue_export_helper_default(tidak_ditemukan_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-6a599a3e"]]);

export { tidak_ditemukan_default as default };
//# sourceMappingURL=tidak-ditemukan-d1VVMMiQ.mjs.map
