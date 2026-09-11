import { _ as _plugin_vue_export_helper_default, v as vue_exports, s as server_renderer_exports, a as _sfc_main$1 } from '../virtual/entry.mjs';
import { u as useFetch, A as AppNavbar_default, b as _sfc_main, _ as _sfc_main$2 } from './SelectMenu-DTgPC44F.mjs';
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

//#region app/pages/rekap-anomali.vue?vue&type=script&setup=true&lang.ts
var rekap_anomali_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "rekap-anomali",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const selectedCodes = (0, vue_exports.ref)([]);
		const numberFormatter = new Intl.NumberFormat("id-ID");
		const statisticCards = [
			{
				key: "total",
				label: "Total"
			},
			{
				key: "unhandled",
				label: "Belum Selesai"
			},
			{
				key: "handled",
				label: "Selesai (Tandai)"
			},
			{
				key: "disappeared",
				label: "Selesai + Anomali Hilang"
			}
		];
		const selectMenuUi = {
			base: "bg-[var(--color-paper)] text-[var(--color-ink-2)] ring-[var(--color-rule-2)] hover:bg-[var(--color-paper-2)]",
			trailingIcon: "text-[var(--color-muted)]",
			content: "w-[min(32rem,calc(100vw-2rem))] bg-[var(--color-paper)] text-[var(--color-ink-2)] ring-[var(--color-rule-2)] shadow-lg",
			input: "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink-2)]",
			item: "text-[var(--color-ink-2)] data-highlighted:not-data-disabled:text-[var(--color-ink)] data-highlighted:not-data-disabled:before:bg-[var(--color-paper-2)]",
			itemLabel: "whitespace-normal break-words",
			itemDescription: "text-[var(--color-muted)]"
		};
		const { data: recap, status: recapStatus, error: recapError } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useFetch("/api/anomali/recap", "$XOfrnMcKZN")), __temp = await __temp, __restore(), __temp);
		const recapItems = (0, vue_exports.computed)(() => recap.value ?? []);
		const anomalyOptions = (0, vue_exports.computed)(() => recapItems.value.map((item) => ({
			label: item.kodeAnomali,
			description: item.deskripsi,
			value: item.kodeAnomali.trim()
		})).filter((item) => item.value.length > 0));
		const visibleRecapItems = (0, vue_exports.computed)(() => {
			if (selectedCodes.value.length === 0) return recapItems.value;
			const selected = new Set(selectedCodes.value);
			return recapItems.value.filter((item) => selected.has(item.kodeAnomali));
		});
		const selectedCodeLabel = (0, vue_exports.computed)(() => selectedCodes.value.length === 0 ? "Semua kode anomali" : `${selectedCodes.value.length} kode dipilih`);
		const isLoading = (0, vue_exports.computed)(() => recapStatus.value === "pending");
		function formatCount(value) {
			return numberFormatter.format(value);
		}
		function showAllCodes() {
			selectedCodes.value = [];
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AppNavbar = AppNavbar_default;
			const _component_USelectMenu = _sfc_main;
			const _component_UButton = _sfc_main$1;
			const _component_USkeleton = _sfc_main$2;
			_push(`<main${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "recap-page" }, _attrs))} data-v-ec63e3d3>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_AppNavbar, null, null, _parent));
			_push(`<section class="page-heading" aria-labelledby="page-title" data-v-ec63e3d3><div data-v-ec63e3d3><h1 id="page-title" data-v-ec63e3d3> Rekap Anomali </h1><p data-v-ec63e3d3> Ringkasan assignment dan anomali per kode. </p></div></section><section class="recap-filter" aria-label="Filter kode anomali" data-v-ec63e3d3><div data-v-ec63e3d3><p class="recap-filter__label" data-v-ec63e3d3> Kode anomali </p><p class="recap-filter__summary" data-v-ec63e3d3>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(selectedCodeLabel))}</p></div><div class="recap-filter__controls" data-v-ec63e3d3>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
				modelValue: (0, vue_exports.unref)(selectedCodes),
				"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(selectedCodes) ? selectedCodes.value = $event : null,
				multiple: "",
				clear: "",
				items: (0, vue_exports.unref)(anomalyOptions),
				"value-key": "value",
				"label-key": "label",
				"description-key": "description",
				color: "neutral",
				variant: "outline",
				size: "md",
				class: "recap-filter__select",
				ui: selectMenuUi,
				"search-input": {
					autofocus: false,
					icon: "i-lucide-search",
					placeholder: "Cari kode atau deskripsi..."
				},
				"filter-fields": ["label", "description"],
				loading: (0, vue_exports.unref)(isLoading),
				placeholder: "Semua anomali",
				"aria-label": "Pilih kode anomali"
			}, null, _parent));
			if ((0, vue_exports.unref)(selectedCodes).length) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				label: "Tampilkan semua",
				color: "neutral",
				variant: "ghost",
				size: "sm",
				onClick: showAllCodes
			}, null, _parent));
			else _push(`<!---->`);
			_push(`</div></section>`);
			if ((0, vue_exports.unref)(isLoading)) {
				_push(`<section class="recap-list" aria-label="Memuat rekap anomali" aria-busy="true" data-v-ec63e3d3><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(4, (index) => {
					_push(`<article class="recap-group" data-v-ec63e3d3><div class="recap-group__heading" data-v-ec63e3d3>`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "recap-group__code-skeleton" }, null, _parent));
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "recap-group__description-skeleton" }, null, _parent));
					_push(`</div><div class="statistics-grid" data-v-ec63e3d3><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(4, (cardIndex) => {
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, {
							key: cardIndex,
							class: "statistics-skeleton"
						}, null, _parent));
					});
					_push(`<!--]--></div></article>`);
				});
				_push(`<!--]--></section>`);
			} else if ((0, vue_exports.unref)(recapError)) _push(`<p class="recap-message recap-message--error" role="alert" data-v-ec63e3d3> Rekap anomali tidak dapat dimuat. Periksa koneksi database, lalu muat ulang halaman. </p>`);
			else if ((0, vue_exports.unref)(visibleRecapItems).length === 0) _push(`<p class="recap-message" data-v-ec63e3d3> Tidak ada kode anomali yang cocok dengan filter. </p>`);
			else {
				_push(`<section class="recap-list" aria-live="polite" data-v-ec63e3d3><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(visibleRecapItems), (item) => {
					_push(`<article class="recap-group" data-v-ec63e3d3><header class="recap-group__heading" data-v-ec63e3d3><h2 data-v-ec63e3d3>${(0, server_renderer_exports.ssrInterpolate)(item.kodeAnomali)}</h2><p data-v-ec63e3d3>${(0, server_renderer_exports.ssrInterpolate)(item.deskripsi)}</p></header><div class="statistics-grid" data-v-ec63e3d3><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(statisticCards, (card) => {
						_push(`<section class="statistics-card"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", `${item.kodeAnomali}, ${card.label}`)} data-v-ec63e3d3><h3 data-v-ec63e3d3>${(0, server_renderer_exports.ssrInterpolate)(card.label)}</h3><div class="statistics-card__metrics" data-v-ec63e3d3><div data-v-ec63e3d3><span data-v-ec63e3d3>Assignment</span><strong data-v-ec63e3d3>${(0, server_renderer_exports.ssrInterpolate)(formatCount(item.statistics[card.key].assignments))}</strong></div><div data-v-ec63e3d3><span data-v-ec63e3d3>Anomali</span><strong data-v-ec63e3d3>${(0, server_renderer_exports.ssrInterpolate)(formatCount(item.statistics[card.key].anomalies))}</strong></div></div></section>`);
					});
					_push(`<!--]--></div></article>`);
				});
				_push(`<!--]--></section>`);
			}
			_push(`</main>`);
		};
	}
});
//#endregion
//#region app/pages/rekap-anomali.vue
var _sfc_setup = rekap_anomali_vue_vue_type_script_setup_true_lang_default.setup;
rekap_anomali_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/rekap-anomali.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var rekap_anomali_default = /*#__PURE__*/ _plugin_vue_export_helper_default(rekap_anomali_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-ec63e3d3"]]);

export { rekap_anomali_default as default };
//# sourceMappingURL=rekap-anomali-DTMxYtpA.mjs.map
