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

//#region app/pages/rekap-kbli.vue?vue&type=script&setup=true&lang.ts
var rekap_kbli_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "rekap-kbli",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const selectedCategories = (0, vue_exports.ref)([]);
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
		const { data: recap, status: recapStatus, error: recapError } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useFetch("/api/kbli/recap", "$tSS48MXaHB")), __temp = await __temp, __restore(), __temp);
		const recapItems = (0, vue_exports.computed)(() => recap.value ?? []);
		const categoryOptions = (0, vue_exports.computed)(() => recapItems.value.map((item) => ({
			label: item.kategori,
			description: item.deskripsi ?? void 0,
			value: item.kategori.trim()
		})).filter((item) => item.value.length > 0));
		const visibleRecapItems = (0, vue_exports.computed)(() => {
			if (selectedCategories.value.length === 0) return recapItems.value;
			const selected = new Set(selectedCategories.value);
			return recapItems.value.filter((item) => selected.has(item.kategori));
		});
		const selectedCategoryLabel = (0, vue_exports.computed)(() => selectedCategories.value.length === 0 ? "Semua kategori KBLI" : `${selectedCategories.value.length} kategori dipilih`);
		const isLoading = (0, vue_exports.computed)(() => recapStatus.value === "pending");
		function formatCount(value) {
			return numberFormatter.format(value);
		}
		function showAllCategories() {
			selectedCategories.value = [];
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AppNavbar = AppNavbar_default;
			const _component_USelectMenu = _sfc_main;
			const _component_UButton = _sfc_main$1;
			const _component_USkeleton = _sfc_main$2;
			_push(`<main${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "recap-page" }, _attrs))} data-v-3d56ed53>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_AppNavbar, null, null, _parent));
			_push(`<section class="page-heading" aria-labelledby="page-title" data-v-3d56ed53><div data-v-3d56ed53><h1 id="page-title" data-v-3d56ed53> Rekap KBLI </h1><p data-v-3d56ed53> Ringkasan assignment dan KBLI per kategori. </p></div></section><section class="recap-filter" aria-label="Filter kategori KBLI" data-v-3d56ed53><div data-v-3d56ed53><p class="recap-filter__label" data-v-3d56ed53> Kategori KBLI </p><p class="recap-filter__summary" data-v-3d56ed53>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(selectedCategoryLabel))}</p></div><div class="recap-filter__controls" data-v-3d56ed53>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
				modelValue: (0, vue_exports.unref)(selectedCategories),
				"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(selectedCategories) ? selectedCategories.value = $event : null,
				multiple: "",
				clear: "",
				items: (0, vue_exports.unref)(categoryOptions),
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
					placeholder: "Cari kategori atau deskripsi..."
				},
				"filter-fields": ["label", "description"],
				loading: (0, vue_exports.unref)(isLoading),
				placeholder: "Semua kategori KBLI",
				"aria-label": "Pilih kategori KBLI"
			}, null, _parent));
			if ((0, vue_exports.unref)(selectedCategories).length) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				label: "Tampilkan semua",
				color: "neutral",
				variant: "ghost",
				size: "sm",
				onClick: showAllCategories
			}, null, _parent));
			else _push(`<!---->`);
			_push(`</div></section>`);
			if ((0, vue_exports.unref)(isLoading)) {
				_push(`<section class="recap-list" aria-label="Memuat rekap KBLI" aria-busy="true" data-v-3d56ed53><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(3, (index) => {
					_push(`<article class="recap-group" data-v-3d56ed53><div class="recap-group__heading" data-v-3d56ed53>`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "recap-group__code-skeleton" }, null, _parent));
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "recap-group__description-skeleton" }, null, _parent));
					_push(`</div><div class="statistics-grid" data-v-3d56ed53><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(3, (cardIndex) => {
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, {
							key: cardIndex,
							class: "statistics-skeleton"
						}, null, _parent));
					});
					_push(`<!--]--></div></article>`);
				});
				_push(`<!--]--></section>`);
			} else if ((0, vue_exports.unref)(recapError)) _push(`<p class="recap-message recap-message--error" role="alert" data-v-3d56ed53> Rekap KBLI tidak dapat dimuat. Periksa koneksi database, lalu muat ulang halaman. </p>`);
			else if ((0, vue_exports.unref)(visibleRecapItems).length === 0) _push(`<p class="recap-message" data-v-3d56ed53> Tidak ada kategori KBLI yang cocok dengan filter. </p>`);
			else {
				_push(`<section class="recap-list" aria-live="polite" data-v-3d56ed53><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(visibleRecapItems), (item) => {
					_push(`<article class="recap-group" data-v-3d56ed53><header class="recap-group__heading" data-v-3d56ed53><h2 data-v-3d56ed53>${(0, server_renderer_exports.ssrInterpolate)(item.kategori)}</h2>`);
					if (item.deskripsi) _push(`<p data-v-3d56ed53>${(0, server_renderer_exports.ssrInterpolate)(item.deskripsi)}</p>`);
					else _push(`<!---->`);
					_push(`</header><div class="statistics-grid" data-v-3d56ed53><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(statisticCards, (card) => {
						_push(`<section class="statistics-card"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", `${item.kategori}, ${card.label}`)} data-v-3d56ed53><h3 data-v-3d56ed53>${(0, server_renderer_exports.ssrInterpolate)(card.label)}</h3><div class="statistics-card__metrics" data-v-3d56ed53><div data-v-3d56ed53><span data-v-3d56ed53>Assignment</span><strong data-v-3d56ed53>${(0, server_renderer_exports.ssrInterpolate)(formatCount(item.statistics[card.key].assignments))}</strong></div><div data-v-3d56ed53><span data-v-3d56ed53>KBLI</span><strong data-v-3d56ed53>${(0, server_renderer_exports.ssrInterpolate)(formatCount(item.statistics[card.key].findings))}</strong></div></div></section>`);
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
//#region app/pages/rekap-kbli.vue
var _sfc_setup = rekap_kbli_vue_vue_type_script_setup_true_lang_default.setup;
rekap_kbli_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/rekap-kbli.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var rekap_kbli_default = /*#__PURE__*/ _plugin_vue_export_helper_default(rekap_kbli_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-3d56ed53"]]);

export { rekap_kbli_default as default };
//# sourceMappingURL=rekap-kbli-Dws6ovoc.mjs.map
