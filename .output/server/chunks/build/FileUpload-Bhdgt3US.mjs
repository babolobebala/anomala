import { v as vue_exports, c as useComponentProps, d as useLocale, e as useAppConfig, f as useForwardProps, r as reactivePick, g as usePortal, k as createReusableTemplate, t as tv, s as server_renderer_exports, V as VisuallyHidden_default, a as _sfc_main$2, F as FieldGroupReset, h as useFormField, o as _sfc_main$3, P as Primitive, b as _sfc_main$5 } from '../virtual/entry.mjs';
import { p as pointerDownOutside, D as DialogRoot_default, d as DialogContent_default, e as DialogTitle_default, f as DialogDescription_default, g as DialogClose_default, a as DialogTrigger_default, b as DialogPortal_default, c as DialogOverlay_default } from './Badge-C_GhtgSf.mjs';

//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fmodal.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fmodal_default = {
	"slots": {
		"overlay": "fixed inset-0",
		"content": "bg-default divide-y divide-default flex flex-col focus:outline-none",
		"header": "flex items-center gap-1.5 p-4 sm:px-6 min-h-(--ui-header-height)",
		"wrapper": "",
		"body": "flex-1 p-4 sm:p-6",
		"footer": "flex items-center gap-1.5 p-4 sm:px-6",
		"title": "text-highlighted font-semibold",
		"description": "mt-1 text-muted text-sm",
		"close": "absolute top-4 end-4"
	},
	"variants": {
		"transition": { "true": {
			"overlay": "data-[state=open]:animate-[fade-in_200ms_var(--ease-out)] data-[state=closed]:animate-[fade-out_200ms_var(--ease-out)]",
			"content": "data-[state=open]:animate-[scale-in_200ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_200ms_var(--ease-out)]"
		} },
		"fullscreen": {
			"true": { "content": "inset-0" },
			"false": { "content": "w-[calc(100vw-2rem)] max-w-lg rounded-lg shadow-lg ring ring-default" }
		},
		"overlay": { "true": { "overlay": "bg-elevated/75" } },
		"scrollable": {
			"true": {
				"overlay": "overflow-y-auto",
				"content": "relative"
			},
			"false": {
				"content": "fixed",
				"body": "overflow-y-auto"
			}
		}
	},
	"compoundVariants": [{
		"scrollable": true,
		"fullscreen": false,
		"class": { "overlay": "grid place-items-center p-4 sm:py-8" }
	}, {
		"scrollable": false,
		"fullscreen": false,
		"class": { "content": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden" }
	}]
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/Modal.vue
var _sfc_main$1 = {
	__name: "UModal",
	__ssrInlineRender: true,
	props: {
		title: {
			type: String,
			required: false
		},
		description: {
			type: String,
			required: false
		},
		content: {
			type: Object,
			required: false
		},
		overlay: {
			type: Boolean,
			required: false,
			default: true
		},
		scrollable: {
			type: Boolean,
			required: false
		},
		transition: {
			type: Boolean,
			required: false,
			default: true
		},
		fullscreen: {
			type: Boolean,
			required: false
		},
		portal: {
			type: [Boolean, String],
			required: false,
			skipCheck: true,
			default: true
		},
		close: {
			type: [Boolean, Object],
			required: false,
			default: true
		},
		closeIcon: {
			type: null,
			required: false
		},
		dismissible: {
			type: Boolean,
			required: false,
			default: true
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		open: {
			type: Boolean,
			required: false
		},
		defaultOpen: {
			type: Boolean,
			required: false
		},
		modal: {
			type: Boolean,
			required: false,
			default: true
		},
		unmountOnHide: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"leave",
		"after:leave",
		"enter",
		"after:enter",
		"close:prevent",
		"update:open"
	],
	setup(__props, { emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = (0, vue_exports.useSlots)();
		const props = useComponentProps("modal", _props);
		const { t } = useLocale();
		const appConfig = useAppConfig();
		const rootProps = useForwardProps(reactivePick(props, "open", "defaultOpen", "modal", "unmountOnHide"), emits);
		const portalProps = usePortal((0, vue_exports.toRef)(() => props.portal));
		const contentProps = (0, vue_exports.toRef)(() => props.content);
		const contentEvents = (0, vue_exports.computed)(() => {
			if (!props.dismissible) return ["interactOutside", "escapeKeyDown"].reduce((acc, curr) => {
				acc[curr] = (e) => {
					e.preventDefault();
					emits("close:prevent");
				};
				return acc;
			}, {});
			return { pointerDownOutside: (e) => pointerDownOutside(e, { scrollable: props.scrollable }) };
		});
		const [DefineContentTemplate, ReuseContentTemplate] = createReusableTemplate();
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fmodal_default,
			...appConfig.ui?.modal || {}
		})({
			transition: props.transition,
			fullscreen: props.fullscreen,
			overlay: props.overlay,
			scrollable: props.scrollable
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogRoot_default), (0, vue_exports.mergeProps)((0, vue_exports.unref)(rootProps), _attrs), {
				default: (0, vue_exports.withCtx)(({ open, close }, _push, _parent, _scopeId) => {
					if (_push) {
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DefineContentTemplate), null, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogContent_default), (0, vue_exports.mergeProps)({
									"data-slot": "content",
									class: ui.value.content({ class: [!slots.default && (0, vue_exports.unref)(props).class, (0, vue_exports.unref)(props).ui?.content] })
								}, contentProps.value, {
									onEnter: ($event) => !(0, vue_exports.unref)(props).scrollable && emits("enter"),
									onAfterEnter: ($event) => !(0, vue_exports.unref)(props).scrollable && emits("after:enter"),
									onLeave: ($event) => !(0, vue_exports.unref)(props).scrollable && emits("leave"),
									onAfterLeave: ($event) => !(0, vue_exports.unref)(props).scrollable && emits("after:leave")
								}, (0, vue_exports.toHandlers)(contentEvents.value)), {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) {
											if (!(0, vue_exports.unref)(props).title && !slots.title || !(0, vue_exports.unref)(props).description && !slots.description || !!slots.content) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(VisuallyHidden_default), null, {
												default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
													if (_push) {
														if (!(0, vue_exports.unref)(props).title && !slots.title) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogTitle_default), null, null, _parent, _scopeId));
														else if (!!slots.content) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogTitle_default), null, {
															default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "title", {}, () => {
																	_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).title)}`);
																}, _push, _parent, _scopeId);
																else return [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])];
															}),
															_: 2
														}, _parent, _scopeId));
														else _push(`<!---->`);
														if (!(0, vue_exports.unref)(props).description && !slots.description) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogDescription_default), null, null, _parent, _scopeId));
														else if (!!slots.content) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogDescription_default), null, {
															default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "description", {}, () => {
																	_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).description)}`);
																}, _push, _parent, _scopeId);
																else return [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])];
															}),
															_: 2
														}, _parent, _scopeId));
														else _push(`<!---->`);
													} else return [!(0, vue_exports.unref)(props).title && !slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 0 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 1 }, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])]),
														_: 3
													})) : (0, vue_exports.createCommentVNode)("", true), !(0, vue_exports.unref)(props).description && !slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 2 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 3 }, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])]),
														_: 3
													})) : (0, vue_exports.createCommentVNode)("", true)];
												}),
												_: 2
											}, _parent, _scopeId));
											else _push(`<!---->`);
											(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "content", { close }, () => {
												if (!!slots.header || (0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description || (0, vue_exports.unref)(props).close || !!slots.close) {
													_push(`<div data-slot="header" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.header({ class: (0, vue_exports.unref)(props).ui?.header }))}"${_scopeId}>`);
													(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "header", { close }, () => {
														if ((0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description) {
															_push(`<div data-slot="wrapper" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper }))}"${_scopeId}>`);
															if ((0, vue_exports.unref)(props).title || !!slots.title) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogTitle_default), {
																"data-slot": "title",
																class: ui.value.title({ class: (0, vue_exports.unref)(props).ui?.title })
															}, {
																default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																	if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "title", {}, () => {
																		_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).title)}`);
																	}, _push, _parent, _scopeId);
																	else return [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])];
																}),
																_: 2
															}, _parent, _scopeId));
															else _push(`<!---->`);
															if ((0, vue_exports.unref)(props).description || !!slots.description) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogDescription_default), {
																"data-slot": "description",
																class: ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description })
															}, {
																default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																	if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "description", {}, () => {
																		_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).description)}`);
																	}, _push, _parent, _scopeId);
																	else return [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])];
																}),
																_: 2
															}, _parent, _scopeId));
															else _push(`<!---->`);
															_push(`</div>`);
														} else _push(`<!---->`);
														(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "actions", {}, null, _push, _parent, _scopeId);
														if ((0, vue_exports.unref)(props).close || !!slots.close) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogClose_default), { "as-child": "" }, {
															default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => {
																	if ((0, vue_exports.unref)(props).close) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$2, (0, vue_exports.mergeProps)({
																		icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
																		color: "neutral",
																		variant: "ghost",
																		"aria-label": (0, vue_exports.unref)(t)("modal.close")
																	}, typeof (0, vue_exports.unref)(props).close === "object" ? (0, vue_exports.unref)(props).close : {}, {
																		"data-slot": "close",
																		class: ui.value.close({ class: (0, vue_exports.unref)(props).ui?.close })
																	}), null, _parent, _scopeId));
																	else _push(`<!---->`);
																}, _push, _parent, _scopeId);
																else return [(0, vue_exports.renderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => [(0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
																	key: 0,
																	icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
																	color: "neutral",
																	variant: "ghost",
																	"aria-label": (0, vue_exports.unref)(t)("modal.close")
																}, typeof (0, vue_exports.unref)(props).close === "object" ? (0, vue_exports.unref)(props).close : {}, {
																	"data-slot": "close",
																	class: ui.value.close({ class: (0, vue_exports.unref)(props).ui?.close })
																}), null, 16, [
																	"icon",
																	"aria-label",
																	"class"
																])) : (0, vue_exports.createCommentVNode)("", true)])];
															}),
															_: 2
														}, _parent, _scopeId));
														else _push(`<!---->`);
													}, _push, _parent, _scopeId);
													_push(`</div>`);
												} else _push(`<!---->`);
												if (!!slots.body) {
													_push(`<div data-slot="body" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.body({ class: (0, vue_exports.unref)(props).ui?.body }))}"${_scopeId}>`);
													(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "body", { close }, null, _push, _parent, _scopeId);
													_push(`</div>`);
												} else _push(`<!---->`);
												if (!!slots.footer) {
													_push(`<div data-slot="footer" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.footer({ class: (0, vue_exports.unref)(props).ui?.footer }))}"${_scopeId}>`);
													(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "footer", { close }, null, _push, _parent, _scopeId);
													_push(`</div>`);
												} else _push(`<!---->`);
											}, _push, _parent, _scopeId);
										} else return [!(0, vue_exports.unref)(props).title && !slots.title || !(0, vue_exports.unref)(props).description && !slots.description || !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(VisuallyHidden_default), { key: 0 }, {
											default: (0, vue_exports.withCtx)(() => [!(0, vue_exports.unref)(props).title && !slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 0 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 1 }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])]),
												_: 3
											})) : (0, vue_exports.createCommentVNode)("", true), !(0, vue_exports.unref)(props).description && !slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 2 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 3 }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])]),
												_: 3
											})) : (0, vue_exports.createCommentVNode)("", true)]),
											_: 3
										})) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.renderSlot)(_ctx.$slots, "content", { close }, () => [
											!!slots.header || (0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description || (0, vue_exports.unref)(props).close || !!slots.close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
												key: 0,
												"data-slot": "header",
												class: ui.value.header({ class: (0, vue_exports.unref)(props).ui?.header })
											}, [(0, vue_exports.renderSlot)(_ctx.$slots, "header", { close }, () => [
												(0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
													key: 0,
													"data-slot": "wrapper",
													class: ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper })
												}, [(0, vue_exports.unref)(props).title || !!slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), {
													key: 0,
													"data-slot": "title",
													class: ui.value.title({ class: (0, vue_exports.unref)(props).ui?.title })
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])]),
													_: 3
												}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), {
													key: 1,
													"data-slot": "description",
													class: ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description })
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])]),
													_: 3
												}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)], 2)) : (0, vue_exports.createCommentVNode)("", true),
												(0, vue_exports.renderSlot)(_ctx.$slots, "actions"),
												(0, vue_exports.unref)(props).close || !!slots.close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogClose_default), {
													key: 1,
													"as-child": ""
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => [(0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
														key: 0,
														icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
														color: "neutral",
														variant: "ghost",
														"aria-label": (0, vue_exports.unref)(t)("modal.close")
													}, typeof (0, vue_exports.unref)(props).close === "object" ? (0, vue_exports.unref)(props).close : {}, {
														"data-slot": "close",
														class: ui.value.close({ class: (0, vue_exports.unref)(props).ui?.close })
													}), null, 16, [
														"icon",
														"aria-label",
														"class"
													])) : (0, vue_exports.createCommentVNode)("", true)])]),
													_: 2
												}, 1024)) : (0, vue_exports.createCommentVNode)("", true)
											])], 2)) : (0, vue_exports.createCommentVNode)("", true),
											!!slots.body ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
												key: 1,
												"data-slot": "body",
												class: ui.value.body({ class: (0, vue_exports.unref)(props).ui?.body })
											}, [(0, vue_exports.renderSlot)(_ctx.$slots, "body", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true),
											!!slots.footer ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
												key: 2,
												"data-slot": "footer",
												class: ui.value.footer({ class: (0, vue_exports.unref)(props).ui?.footer })
											}, [(0, vue_exports.renderSlot)(_ctx.$slots, "footer", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true)
										])];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(DialogContent_default), (0, vue_exports.mergeProps)({
									"data-slot": "content",
									class: ui.value.content({ class: [!slots.default && (0, vue_exports.unref)(props).class, (0, vue_exports.unref)(props).ui?.content] })
								}, contentProps.value, {
									onEnter: ($event) => !(0, vue_exports.unref)(props).scrollable && emits("enter"),
									onAfterEnter: ($event) => !(0, vue_exports.unref)(props).scrollable && emits("after:enter"),
									onLeave: ($event) => !(0, vue_exports.unref)(props).scrollable && emits("leave"),
									onAfterLeave: ($event) => !(0, vue_exports.unref)(props).scrollable && emits("after:leave")
								}, (0, vue_exports.toHandlers)(contentEvents.value)), {
									default: (0, vue_exports.withCtx)(() => [!(0, vue_exports.unref)(props).title && !slots.title || !(0, vue_exports.unref)(props).description && !slots.description || !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(VisuallyHidden_default), { key: 0 }, {
										default: (0, vue_exports.withCtx)(() => [!(0, vue_exports.unref)(props).title && !slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 0 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 1 }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])]),
											_: 3
										})) : (0, vue_exports.createCommentVNode)("", true), !(0, vue_exports.unref)(props).description && !slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 2 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 3 }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])]),
											_: 3
										})) : (0, vue_exports.createCommentVNode)("", true)]),
										_: 3
									})) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.renderSlot)(_ctx.$slots, "content", { close }, () => [
										!!slots.header || (0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description || (0, vue_exports.unref)(props).close || !!slots.close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 0,
											"data-slot": "header",
											class: ui.value.header({ class: (0, vue_exports.unref)(props).ui?.header })
										}, [(0, vue_exports.renderSlot)(_ctx.$slots, "header", { close }, () => [
											(0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
												key: 0,
												"data-slot": "wrapper",
												class: ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper })
											}, [(0, vue_exports.unref)(props).title || !!slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), {
												key: 0,
												"data-slot": "title",
												class: ui.value.title({ class: (0, vue_exports.unref)(props).ui?.title })
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])]),
												_: 3
											}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), {
												key: 1,
												"data-slot": "description",
												class: ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description })
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])]),
												_: 3
											}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)], 2)) : (0, vue_exports.createCommentVNode)("", true),
											(0, vue_exports.renderSlot)(_ctx.$slots, "actions"),
											(0, vue_exports.unref)(props).close || !!slots.close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogClose_default), {
												key: 1,
												"as-child": ""
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => [(0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
													key: 0,
													icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
													color: "neutral",
													variant: "ghost",
													"aria-label": (0, vue_exports.unref)(t)("modal.close")
												}, typeof (0, vue_exports.unref)(props).close === "object" ? (0, vue_exports.unref)(props).close : {}, {
													"data-slot": "close",
													class: ui.value.close({ class: (0, vue_exports.unref)(props).ui?.close })
												}), null, 16, [
													"icon",
													"aria-label",
													"class"
												])) : (0, vue_exports.createCommentVNode)("", true)])]),
												_: 2
											}, 1024)) : (0, vue_exports.createCommentVNode)("", true)
										])], 2)) : (0, vue_exports.createCommentVNode)("", true),
										!!slots.body ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 1,
											"data-slot": "body",
											class: ui.value.body({ class: (0, vue_exports.unref)(props).ui?.body })
										}, [(0, vue_exports.renderSlot)(_ctx.$slots, "body", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true),
										!!slots.footer ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 2,
											"data-slot": "footer",
											class: ui.value.footer({ class: (0, vue_exports.unref)(props).ui?.footer })
										}, [(0, vue_exports.renderSlot)(_ctx.$slots, "footer", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true)
									])]),
									_: 2
								}, 1040, [
									"class",
									"onEnter",
									"onAfterEnter",
									"onLeave",
									"onAfterLeave"
								])];
							}),
							_: 2
						}, _parent, _scopeId));
						if (!!slots.default) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogTrigger_default), {
							"as-child": "",
							class: (0, vue_exports.unref)(props).class
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", { open }, null, _push, _parent, _scopeId);
								else return [(0, vue_exports.renderSlot)(_ctx.$slots, "default", { open })];
							}),
							_: 2
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogPortal_default), (0, vue_exports.mergeProps)((0, vue_exports.unref)(portalProps), { "force-mount": (0, vue_exports.unref)(portalProps).disabled && (0, vue_exports.unref)(props).unmountOnHide === false || void 0 }), {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(FieldGroupReset), null, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) {
											if ((0, vue_exports.unref)(props).scrollable) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogOverlay_default), {
												"data-slot": "overlay",
												class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay }),
												onEnter: ($event) => emits("enter"),
												onAfterEnter: ($event) => emits("after:enter"),
												onLeave: ($event) => emits("leave"),
												onAfterLeave: ($event) => emits("after:leave")
											}, {
												default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
													if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseContentTemplate), null, null, _parent, _scopeId));
													else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseContentTemplate))];
												}),
												_: 2
											}, _parent, _scopeId));
											else {
												_push(`<!--[-->`);
												if ((0, vue_exports.unref)(props).overlay) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogOverlay_default), {
													"data-slot": "overlay",
													class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
												}, null, _parent, _scopeId));
												else _push(`<!---->`);
												_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseContentTemplate), null, null, _parent, _scopeId));
												_push(`<!--]-->`);
											}
										} else return [(0, vue_exports.unref)(props).scrollable ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
											key: 0,
											"data-slot": "overlay",
											class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay }),
											onEnter: ($event) => emits("enter"),
											onAfterEnter: ($event) => emits("after:enter"),
											onLeave: ($event) => emits("leave"),
											onAfterLeave: ($event) => emits("after:leave")
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseContentTemplate))]),
											_: 1
										}, 8, [
											"class",
											"onEnter",
											"onAfterEnter",
											"onLeave",
											"onAfterLeave"
										])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [(0, vue_exports.unref)(props).overlay ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
											key: 0,
											"data-slot": "overlay",
											class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
										}, null, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseContentTemplate))], 64))];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(FieldGroupReset), null, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.unref)(props).scrollable ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
										key: 0,
										"data-slot": "overlay",
										class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay }),
										onEnter: ($event) => emits("enter"),
										onAfterEnter: ($event) => emits("after:enter"),
										onLeave: ($event) => emits("leave"),
										onAfterLeave: ($event) => emits("after:leave")
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseContentTemplate))]),
										_: 1
									}, 8, [
										"class",
										"onEnter",
										"onAfterEnter",
										"onLeave",
										"onAfterLeave"
									])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [(0, vue_exports.unref)(props).overlay ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
										key: 0,
										"data-slot": "overlay",
										class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
									}, null, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseContentTemplate))], 64))]),
									_: 1
								})];
							}),
							_: 2
						}, _parent, _scopeId));
					} else return [
						(0, vue_exports.createVNode)((0, vue_exports.unref)(DefineContentTemplate), null, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(DialogContent_default), (0, vue_exports.mergeProps)({
								"data-slot": "content",
								class: ui.value.content({ class: [!slots.default && (0, vue_exports.unref)(props).class, (0, vue_exports.unref)(props).ui?.content] })
							}, contentProps.value, {
								onEnter: ($event) => !(0, vue_exports.unref)(props).scrollable && emits("enter"),
								onAfterEnter: ($event) => !(0, vue_exports.unref)(props).scrollable && emits("after:enter"),
								onLeave: ($event) => !(0, vue_exports.unref)(props).scrollable && emits("leave"),
								onAfterLeave: ($event) => !(0, vue_exports.unref)(props).scrollable && emits("after:leave")
							}, (0, vue_exports.toHandlers)(contentEvents.value)), {
								default: (0, vue_exports.withCtx)(() => [!(0, vue_exports.unref)(props).title && !slots.title || !(0, vue_exports.unref)(props).description && !slots.description || !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(VisuallyHidden_default), { key: 0 }, {
									default: (0, vue_exports.withCtx)(() => [!(0, vue_exports.unref)(props).title && !slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 0 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 1 }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])]),
										_: 3
									})) : (0, vue_exports.createCommentVNode)("", true), !(0, vue_exports.unref)(props).description && !slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 2 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 3 }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])]),
										_: 3
									})) : (0, vue_exports.createCommentVNode)("", true)]),
									_: 3
								})) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.renderSlot)(_ctx.$slots, "content", { close }, () => [
									!!slots.header || (0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description || (0, vue_exports.unref)(props).close || !!slots.close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 0,
										"data-slot": "header",
										class: ui.value.header({ class: (0, vue_exports.unref)(props).ui?.header })
									}, [(0, vue_exports.renderSlot)(_ctx.$slots, "header", { close }, () => [
										(0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 0,
											"data-slot": "wrapper",
											class: ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper })
										}, [(0, vue_exports.unref)(props).title || !!slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), {
											key: 0,
											"data-slot": "title",
											class: ui.value.title({ class: (0, vue_exports.unref)(props).ui?.title })
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])]),
											_: 3
										}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), {
											key: 1,
											"data-slot": "description",
											class: ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description })
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])]),
											_: 3
										}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)], 2)) : (0, vue_exports.createCommentVNode)("", true),
										(0, vue_exports.renderSlot)(_ctx.$slots, "actions"),
										(0, vue_exports.unref)(props).close || !!slots.close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogClose_default), {
											key: 1,
											"as-child": ""
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => [(0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
												key: 0,
												icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
												color: "neutral",
												variant: "ghost",
												"aria-label": (0, vue_exports.unref)(t)("modal.close")
											}, typeof (0, vue_exports.unref)(props).close === "object" ? (0, vue_exports.unref)(props).close : {}, {
												"data-slot": "close",
												class: ui.value.close({ class: (0, vue_exports.unref)(props).ui?.close })
											}), null, 16, [
												"icon",
												"aria-label",
												"class"
											])) : (0, vue_exports.createCommentVNode)("", true)])]),
											_: 2
										}, 1024)) : (0, vue_exports.createCommentVNode)("", true)
									])], 2)) : (0, vue_exports.createCommentVNode)("", true),
									!!slots.body ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 1,
										"data-slot": "body",
										class: ui.value.body({ class: (0, vue_exports.unref)(props).ui?.body })
									}, [(0, vue_exports.renderSlot)(_ctx.$slots, "body", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true),
									!!slots.footer ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 2,
										"data-slot": "footer",
										class: ui.value.footer({ class: (0, vue_exports.unref)(props).ui?.footer })
									}, [(0, vue_exports.renderSlot)(_ctx.$slots, "footer", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true)
								])]),
								_: 2
							}, 1040, [
								"class",
								"onEnter",
								"onAfterEnter",
								"onLeave",
								"onAfterLeave"
							])]),
							_: 2
						}, 1024),
						!!slots.default ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTrigger_default), {
							key: 0,
							"as-child": "",
							class: (0, vue_exports.unref)(props).class
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", { open })]),
							_: 2
						}, 1032, ["class"])) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.createVNode)((0, vue_exports.unref)(DialogPortal_default), (0, vue_exports.mergeProps)((0, vue_exports.unref)(portalProps), { "force-mount": (0, vue_exports.unref)(portalProps).disabled && (0, vue_exports.unref)(props).unmountOnHide === false || void 0 }), {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(FieldGroupReset), null, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.unref)(props).scrollable ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
									key: 0,
									"data-slot": "overlay",
									class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay }),
									onEnter: ($event) => emits("enter"),
									onAfterEnter: ($event) => emits("after:enter"),
									onLeave: ($event) => emits("leave"),
									onAfterLeave: ($event) => emits("after:leave")
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseContentTemplate))]),
									_: 1
								}, 8, [
									"class",
									"onEnter",
									"onAfterEnter",
									"onLeave",
									"onAfterLeave"
								])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [(0, vue_exports.unref)(props).overlay ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
									key: 0,
									"data-slot": "overlay",
									class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
								}, null, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseContentTemplate))], 64))]),
								_: 1
							})]),
							_: 1
						}, 16, ["force-mount"])
					];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/Modal.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/composables/useFileUpload.js
function parseAcceptToDataTypes(accept) {
	if (!accept || accept === "*") return [];
	return accept.split(",").map((type) => {
		const trimmedType = type.trim();
		if (trimmedType.includes("/") && trimmedType.endsWith("/*")) return trimmedType.split("/")[0] || trimmedType;
		return trimmedType;
	}).filter((type) => {
		return !type.startsWith(".");
	});
}
function useFileUpload(options) {
	const { accept = "*"} = options;
	const inputRef = (0, vue_exports.ref)();
	const dropzoneRef = (0, vue_exports.ref)();
	(0, vue_exports.computed)(() => parseAcceptToDataTypes((0, vue_exports.unref)(accept)));
	const isDragging = (0, vue_exports.ref)(false);
	const fileDialog = (0, vue_exports.reactive)({ open: () => {} });
	function open() {
		fileDialog.open();
	}
	return {
		isDragging,
		open,
		inputRef,
		dropzoneRef
	};
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Ffile-upload.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Ffile_upload_default = {
	"slots": {
		"root": "relative flex flex-col",
		"base": ["w-full flex-1 bg-default border border-default flex flex-col gap-2 items-stretch justify-center rounded-lg focus-visible:outline-3", "transition-[background] ease-out"],
		"wrapper": "flex flex-col items-center justify-center text-center",
		"icon": "shrink-0",
		"avatar": "shrink-0",
		"label": "font-medium text-default mt-2",
		"description": "text-muted mt-1",
		"actions": "flex flex-wrap gap-1.5 shrink-0 mt-4",
		"files": "",
		"file": "relative",
		"fileLeadingAvatar": "shrink-0",
		"fileWrapper": "flex flex-col min-w-0",
		"fileName": "text-default truncate",
		"fileSize": "text-muted truncate",
		"fileTrailingButton": ""
	},
	"variants": {
		"color": {
			"primary": "",
			"secondary": "",
			"success": "",
			"info": "",
			"warning": "",
			"error": "",
			"neutral": ""
		},
		"variant": {
			"area": {
				"wrapper": "px-4 py-3",
				"base": "p-4"
			},
			"button": {}
		},
		"size": {
			"xs": {
				"base": "text-xs",
				"icon": "size-4",
				"file": "text-xs px-2 py-1 gap-1",
				"fileWrapper": "flex-row gap-1"
			},
			"sm": {
				"base": "text-xs",
				"icon": "size-4",
				"file": "text-xs px-2.5 py-1.5 gap-1.5",
				"fileWrapper": "flex-row gap-1"
			},
			"md": {
				"base": "text-sm",
				"icon": "size-5",
				"file": "text-xs px-2.5 py-1.5 gap-1.5"
			},
			"lg": {
				"base": "text-sm",
				"icon": "size-5",
				"file": "text-sm px-3 py-2 gap-2",
				"fileSize": "text-xs"
			},
			"xl": {
				"base": "text-base",
				"icon": "size-6",
				"file": "text-sm px-3 py-2 gap-2"
			}
		},
		"layout": {
			"list": {
				"root": "gap-2 items-start",
				"files": "flex flex-col w-full gap-2",
				"file": "min-w-0 flex items-center border border-default rounded-md w-full",
				"fileTrailingButton": "ms-auto"
			},
			"grid": {
				"fileWrapper": "hidden",
				"fileLeadingAvatar": "size-full rounded-lg",
				"fileTrailingButton": "absolute -top-1.5 -end-1.5 p-0 rounded-full border-2 border-bg"
			}
		},
		"position": {
			"inside": "",
			"outside": ""
		},
		"dropzone": { "true": "border-dashed data-[dragging=true]:bg-elevated/25" },
		"interactive": { "true": "" },
		"highlight": { "true": "" },
		"multiple": { "true": "" },
		"disabled": { "true": "cursor-not-allowed opacity-75" }
	},
	"compoundVariants": [
		{
			"color": "primary",
			"class": "outline-primary/25 focus-visible:outline-3 focus-visible:border-primary"
		},
		{
			"color": "secondary",
			"class": "outline-secondary/25 focus-visible:outline-3 focus-visible:border-secondary"
		},
		{
			"color": "success",
			"class": "outline-success/25 focus-visible:outline-3 focus-visible:border-success"
		},
		{
			"color": "info",
			"class": "outline-info/25 focus-visible:outline-3 focus-visible:border-info"
		},
		{
			"color": "warning",
			"class": "outline-warning/25 focus-visible:outline-3 focus-visible:border-warning"
		},
		{
			"color": "error",
			"class": "outline-error/25 focus-visible:outline-3 focus-visible:border-error"
		},
		{
			"color": "primary",
			"highlight": true,
			"class": "border-primary"
		},
		{
			"color": "secondary",
			"highlight": true,
			"class": "border-secondary"
		},
		{
			"color": "success",
			"highlight": true,
			"class": "border-success"
		},
		{
			"color": "info",
			"highlight": true,
			"class": "border-info"
		},
		{
			"color": "warning",
			"highlight": true,
			"class": "border-warning"
		},
		{
			"color": "error",
			"highlight": true,
			"class": "border-error"
		},
		{
			"color": "neutral",
			"class": "outline-inverted/25 focus-visible:outline-3 focus-visible:border-inverted"
		},
		{
			"color": "neutral",
			"highlight": true,
			"class": "border-inverted"
		},
		{
			"size": "xs",
			"layout": "list",
			"class": { "fileTrailingButton": "-me-1" }
		},
		{
			"size": "sm",
			"layout": "list",
			"class": { "fileTrailingButton": "-me-1.5" }
		},
		{
			"size": "md",
			"layout": "list",
			"class": { "fileTrailingButton": "-me-1.5" }
		},
		{
			"size": "lg",
			"layout": "list",
			"class": { "fileTrailingButton": "-me-2" }
		},
		{
			"size": "xl",
			"layout": "list",
			"class": { "fileTrailingButton": "-me-2" }
		},
		{
			"variant": "button",
			"size": "xs",
			"class": { "base": "p-1" }
		},
		{
			"variant": "button",
			"size": "sm",
			"class": { "base": "p-1.5" }
		},
		{
			"variant": "button",
			"size": "md",
			"class": { "base": "p-1.5" }
		},
		{
			"variant": "button",
			"size": "lg",
			"class": { "base": "p-2" }
		},
		{
			"variant": "button",
			"size": "xl",
			"class": { "base": "p-2" }
		},
		{
			"layout": "grid",
			"multiple": true,
			"class": {
				"files": "grid grid-cols-2 md:grid-cols-3 gap-4 w-full",
				"file": "p-0 aspect-square"
			}
		},
		{
			"layout": "grid",
			"multiple": false,
			"class": { "file": "absolute inset-0 p-0" }
		},
		{
			"interactive": true,
			"disabled": false,
			"class": "hover:bg-elevated/25"
		}
	],
	"defaultVariants": {
		"color": "primary",
		"variant": "area",
		"size": "md"
	}
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/FileUpload.vue
var _sfc_main = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "UFileUpload",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ (0, vue_exports.mergeModels)({
		as: {
			type: null,
			required: false
		},
		id: {
			type: String,
			required: false
		},
		name: {
			type: String,
			required: false
		},
		icon: {
			type: [String, Boolean],
			required: false,
			skipCheck: true
		},
		label: {
			type: String,
			required: false
		},
		description: {
			type: String,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		variant: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		layout: {
			type: null,
			required: false,
			default: "grid"
		},
		position: {
			type: null,
			required: false,
			default: "outside"
		},
		highlight: {
			type: Boolean,
			required: false
		},
		accept: {
			type: String,
			required: false,
			default: "*"
		},
		multiple: {
			type: Boolean,
			required: false,
			default: false
		},
		reset: {
			type: Boolean,
			required: false,
			default: false
		},
		dropzone: {
			type: Boolean,
			required: false,
			default: true
		},
		interactive: {
			type: Boolean,
			required: false,
			default: true
		},
		required: {
			type: Boolean,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		fileIcon: {
			type: null,
			required: false
		},
		fileImage: {
			type: Boolean,
			required: false,
			default: true
		},
		fileDelete: {
			type: [Boolean, Object],
			required: false,
			default: true
		},
		fileDeleteIcon: {
			type: null,
			required: false
		},
		preview: {
			type: Boolean,
			required: false,
			default: true
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		}
	}, {
		"modelValue": { type: null },
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ (0, vue_exports.mergeModels)(["change"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = (0, vue_exports.useSlots)();
		const modelValue = (0, vue_exports.useModel)(__props, "modelValue");
		const props = useComponentProps("fileUpload", _props);
		const appConfig = useAppConfig();
		const { t } = useLocale();
		const [DefineFilesTemplate, ReuseFilesTemplate] = createReusableTemplate();
		const { accept, multiple, reset } = (0, vue_exports.toRefs)(_props);
		const { isDragging, open, inputRef, dropzoneRef } = useFileUpload({
			accept,
			dropzone: props.dropzone});
		const { emitFormInput, emitFormChange, id, name, size: formFieldSize, color: formFieldColor, highlight: formFieldHighlight, disabled: formFieldDisabled, ariaAttrs } = useFormField(_props);
		const color = (0, vue_exports.computed)(() => formFieldColor.value ?? props.color);
		const highlight = (0, vue_exports.computed)(() => formFieldHighlight.value ?? props.highlight);
		const size = (0, vue_exports.computed)(() => formFieldSize.value ?? props.size);
		const disabled = (0, vue_exports.computed)(() => formFieldDisabled.value ?? props.disabled);
		const variant = (0, vue_exports.computed)(() => props.multiple ? "area" : props.variant);
		const layout = (0, vue_exports.computed)(() => props.variant === "button" && !props.multiple ? "grid" : props.layout);
		const position = (0, vue_exports.computed)(() => {
			if (layout.value === "grid" && props.multiple) return "inside";
			if (variant.value === "button") return "outside";
			return props.position;
		});
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Ffile_upload_default,
			...appConfig.ui?.fileUpload || {}
		})({
			dropzone: props.dropzone,
			interactive: props.interactive,
			color: color.value,
			size: size.value,
			variant: variant.value,
			layout: layout.value,
			position: position.value,
			multiple: props.multiple,
			highlight: highlight.value,
			disabled: disabled.value
		}));
		function createObjectUrl(file) {
			if (!props.fileImage) return void 0;
			return URL.createObjectURL(file);
		}
		function formatFileSize(bytes) {
			if (bytes === 0) return "0B";
			const k = 1024;
			const sizes = [
				"B",
				"KB",
				"MB",
				"GB"
			];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			const value = bytes / Math.pow(k, i);
			return `${i === 0 ? value.toString() : value.toFixed(0)}${sizes[i]}`;
		}
		function onUpdate(files, reset2 = false) {
			if (disabled.value) return;
			if (props.multiple) {
				if (reset2) modelValue.value = files;
				else {
					const existingFiles = modelValue.value || [];
					modelValue.value = [...existingFiles, ...files || []];
				}
			} else modelValue.value = files?.[0] ?? null;
			const event = new Event("change", { target: { value: modelValue.value } });
			emits("change", event);
			emitFormChange();
			emitFormInput();
		}
		function removeFile(index) {
			if (!modelValue.value) return;
			if (!props.multiple || index === void 0) {
				onUpdate([], true);
				dropzoneRef.value?.focus();
				return;
			}
			const files = [...modelValue.value];
			files.splice(index, 1);
			onUpdate(files, true);
			dropzoneRef.value?.focus();
		}
		(0, vue_exports.watch)(modelValue, (newValue) => {
			if ((props.multiple ? !newValue?.length : !newValue) && inputRef.value?.$el) inputRef.value.$el.value = "";
		});
		__expose({
			inputRef: (0, vue_exports.toRef)(() => inputRef.value?.$el),
			dropzoneRef
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DefineFilesTemplate), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						if ((0, vue_exports.unref)(props).preview && modelValue.value && (Array.isArray(modelValue.value) ? modelValue.value.length : true)) {
							_push(`<!--[-->`);
							(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "files-top", {
								files: modelValue.value,
								open: (0, vue_exports.unref)(open),
								removeFile
							}, null, _push, _parent, _scopeId);
							_push(`<div data-slot="files" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.files({ class: (0, vue_exports.unref)(props).ui?.files }))}"${_scopeId}>`);
							(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "files", {
								files: modelValue.value,
								removeFile
							}, () => {
								_push(`<!--[-->`);
								(0, server_renderer_exports.ssrRenderList)(Array.isArray(modelValue.value) ? modelValue.value : [modelValue.value], (file, index) => {
									_push(`<div data-slot="file" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.file({ class: (0, vue_exports.unref)(props).ui?.file }))}"${_scopeId}>`);
									(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "file", {
										file,
										index,
										removeFile
									}, () => {
										(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "file-leading", {
											file,
											index,
											ui: ui.value
										}, () => {
											_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$3, {
												as: { img: "img" },
												src: createObjectUrl(file),
												icon: (0, vue_exports.unref)(props).fileIcon || (0, vue_exports.unref)(appConfig).ui.icons.file,
												size: size.value,
												"data-slot": "fileLeadingAvatar",
												class: ui.value.fileLeadingAvatar({ class: (0, vue_exports.unref)(props).ui?.fileLeadingAvatar })
											}, null, _parent, _scopeId));
										}, _push, _parent, _scopeId);
										_push(`<div data-slot="fileWrapper" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.fileWrapper({ class: (0, vue_exports.unref)(props).ui?.fileWrapper }))}"${_scopeId}><span data-slot="fileName" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.fileName({ class: (0, vue_exports.unref)(props).ui?.fileName }))}"${_scopeId}>`);
										(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "file-name", {
											file,
											index
										}, () => {
											_push(`${(0, server_renderer_exports.ssrInterpolate)(file.name)}`);
										}, _push, _parent, _scopeId);
										_push(`</span><span data-slot="fileSize" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.fileSize({ class: (0, vue_exports.unref)(props).ui?.fileSize }))}"${_scopeId}>`);
										(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "file-size", {
											file,
											index
										}, () => {
											_push(`${(0, server_renderer_exports.ssrInterpolate)(formatFileSize(file.size))}`);
										}, _push, _parent, _scopeId);
										_push(`</span></div>`);
										(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "file-trailing", {
											file,
											index,
											ui: ui.value,
											removeFile
										}, () => {
											if ((0, vue_exports.unref)(props).fileDelete) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$2, (0, vue_exports.mergeProps)({ color: "neutral" }, { ref_for: true }, {
												...layout.value === "grid" ? {
													variant: "solid",
													size: "xs"
												} : {
													variant: "link",
													size: size.value
												},
												...typeof (0, vue_exports.unref)(props).fileDelete === "object" ? (0, vue_exports.unref)(props).fileDelete : void 0
											}, {
												"aria-label": (0, vue_exports.unref)(t)("fileUpload.removeFile", { filename: file.name }),
												"trailing-icon": (0, vue_exports.unref)(props).fileDeleteIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
												"data-slot": "fileTrailingButton",
												class: ui.value.fileTrailingButton({ class: (0, vue_exports.unref)(props).ui?.fileTrailingButton }),
												onClick: ($event) => removeFile(index)
											}), null, _parent, _scopeId));
											else _push(`<!---->`);
										}, _push, _parent, _scopeId);
									}, _push, _parent, _scopeId);
									_push(`</div>`);
								});
								_push(`<!--]-->`);
							}, _push, _parent, _scopeId);
							_push(`</div>`);
							(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "files-bottom", {
								files: modelValue.value,
								open: (0, vue_exports.unref)(open),
								removeFile
							}, null, _push, _parent, _scopeId);
							_push(`<!--]-->`);
						} else _push(`<!---->`);
					} else return [(0, vue_exports.unref)(props).preview && modelValue.value && (Array.isArray(modelValue.value) ? modelValue.value.length : true) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [
						(0, vue_exports.renderSlot)(_ctx.$slots, "files-top", {
							files: modelValue.value,
							open: (0, vue_exports.unref)(open),
							removeFile
						}),
						(0, vue_exports.createVNode)("div", {
							"data-slot": "files",
							class: ui.value.files({ class: (0, vue_exports.unref)(props).ui?.files })
						}, [(0, vue_exports.renderSlot)(_ctx.$slots, "files", {
							files: modelValue.value,
							removeFile
						}, () => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(Array.isArray(modelValue.value) ? modelValue.value : [modelValue.value], (file, index) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: file.name,
								"data-slot": "file",
								class: ui.value.file({ class: (0, vue_exports.unref)(props).ui?.file })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "file", {
								file,
								index,
								removeFile
							}, () => [
								(0, vue_exports.renderSlot)(_ctx.$slots, "file-leading", {
									file,
									index,
									ui: ui.value
								}, () => [(0, vue_exports.createVNode)(_sfc_main$3, {
									as: { img: "img" },
									src: createObjectUrl(file),
									icon: (0, vue_exports.unref)(props).fileIcon || (0, vue_exports.unref)(appConfig).ui.icons.file,
									size: size.value,
									"data-slot": "fileLeadingAvatar",
									class: ui.value.fileLeadingAvatar({ class: (0, vue_exports.unref)(props).ui?.fileLeadingAvatar })
								}, null, 8, [
									"src",
									"icon",
									"size",
									"class"
								])]),
								(0, vue_exports.createVNode)("div", {
									"data-slot": "fileWrapper",
									class: ui.value.fileWrapper({ class: (0, vue_exports.unref)(props).ui?.fileWrapper })
								}, [(0, vue_exports.createVNode)("span", {
									"data-slot": "fileName",
									class: ui.value.fileName({ class: (0, vue_exports.unref)(props).ui?.fileName })
								}, [(0, vue_exports.renderSlot)(_ctx.$slots, "file-name", {
									file,
									index
								}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(file.name), 1)])], 2), (0, vue_exports.createVNode)("span", {
									"data-slot": "fileSize",
									class: ui.value.fileSize({ class: (0, vue_exports.unref)(props).ui?.fileSize })
								}, [(0, vue_exports.renderSlot)(_ctx.$slots, "file-size", {
									file,
									index
								}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(formatFileSize(file.size)), 1)])], 2)], 2),
								(0, vue_exports.renderSlot)(_ctx.$slots, "file-trailing", {
									file,
									index,
									ui: ui.value,
									removeFile
								}, () => [(0, vue_exports.unref)(props).fileDelete ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
									key: 0,
									color: "neutral"
								}, { ref_for: true }, {
									...layout.value === "grid" ? {
										variant: "solid",
										size: "xs"
									} : {
										variant: "link",
										size: size.value
									},
									...typeof (0, vue_exports.unref)(props).fileDelete === "object" ? (0, vue_exports.unref)(props).fileDelete : void 0
								}, {
									"aria-label": (0, vue_exports.unref)(t)("fileUpload.removeFile", { filename: file.name }),
									"trailing-icon": (0, vue_exports.unref)(props).fileDeleteIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
									"data-slot": "fileTrailingButton",
									class: ui.value.fileTrailingButton({ class: (0, vue_exports.unref)(props).ui?.fileTrailingButton }),
									onClick: (0, vue_exports.withModifiers)(($event) => removeFile(index), ["stop", "prevent"])
								}), null, 16, [
									"aria-label",
									"trailing-icon",
									"class",
									"onClick"
								])) : (0, vue_exports.createCommentVNode)("", true)])
							])], 2);
						}), 128))])], 2),
						(0, vue_exports.renderSlot)(_ctx.$slots, "files-bottom", {
							files: modelValue.value,
							open: (0, vue_exports.unref)(open),
							removeFile
						})
					], 64)) : (0, vue_exports.createCommentVNode)("", true)];
				}),
				_: 3
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Primitive), {
				as: (0, vue_exports.unref)(props).as,
				"data-slot": _ctx.$attrs["data-slot"] ?? "root",
				class: ui.value.root({ class: [(0, vue_exports.unref)(props).ui?.root, (0, vue_exports.unref)(props).class] })
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {
							open: (0, vue_exports.unref)(open),
							removeFile,
							ui: ui.value
						}, () => {
							(0, server_renderer_exports.ssrRenderVNode)(_push, (0, vue_exports.createVNode)((0, vue_exports.resolveDynamicComponent)(variant.value === "button" ? "button" : "div"), {
								ref_key: "dropzoneRef",
								ref: dropzoneRef,
								type: variant.value === "button" ? "button" : void 0,
								role: variant.value === "button" ? void 0 : "button",
								disabled: variant.value === "button" ? disabled.value : void 0,
								"aria-disabled": variant.value === "button" ? void 0 : disabled.value || void 0,
								"data-dragging": (0, vue_exports.unref)(isDragging),
								"data-slot": "base",
								class: ui.value.base({ class: (0, vue_exports.unref)(props).ui?.base }),
								tabindex: (0, vue_exports.unref)(props).interactive && !disabled.value ? 0 : -1,
								onClick: ($event) => (0, vue_exports.unref)(props).interactive && !disabled.value && (0, vue_exports.unref)(open)(),
								onKeydown: () => {},
								onKeyup: ($event) => (0, vue_exports.unref)(props).interactive && !disabled.value && (0, vue_exports.unref)(open)()
							}, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) {
										if (position.value === "inside") _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseFilesTemplate), null, null, _parent, _scopeId));
										else _push(`<!---->`);
										if (position.value === "inside" ? !(0, vue_exports.unref)(props).preview || ((0, vue_exports.unref)(multiple) ? !modelValue.value?.length : !modelValue.value) : true) {
											_push(`<div data-slot="wrapper" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper }))}"${_scopeId}>`);
											(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "leading", { ui: ui.value }, () => {
												if ((0, vue_exports.unref)(props).icon !== false) {
													_push(`<!--[-->`);
													if (variant.value === "button") _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$5, {
														name: (0, vue_exports.unref)(props).icon ?? (0, vue_exports.unref)(appConfig).ui.icons.upload,
														"data-slot": "icon",
														class: ui.value.icon({ class: (0, vue_exports.unref)(props).ui?.icon })
													}, null, _parent, _scopeId));
													else _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$3, {
														icon: (0, vue_exports.unref)(props).icon ?? (0, vue_exports.unref)(appConfig).ui.icons.upload,
														size: size.value,
														"data-slot": "avatar",
														class: ui.value.avatar({ class: (0, vue_exports.unref)(props).ui?.avatar })
													}, null, _parent, _scopeId));
													_push(`<!--]-->`);
												} else _push(`<!---->`);
											}, _push, _parent, _scopeId);
											if (variant.value !== "button") {
												_push(`<!--[-->`);
												if ((0, vue_exports.unref)(props).label || !!slots.label) {
													_push(`<div data-slot="label" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.label({ class: (0, vue_exports.unref)(props).ui?.label }))}"${_scopeId}>`);
													(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "label", {}, () => {
														_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).label)}`);
													}, _push, _parent, _scopeId);
													_push(`</div>`);
												} else _push(`<!---->`);
												if ((0, vue_exports.unref)(props).description || !!slots.description) {
													_push(`<div data-slot="description" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description }))}"${_scopeId}>`);
													(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "description", {}, () => {
														_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).description)}`);
													}, _push, _parent, _scopeId);
													_push(`</div>`);
												} else _push(`<!---->`);
												if (!!slots.actions) {
													_push(`<div data-slot="actions" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.actions({ class: (0, vue_exports.unref)(props).ui?.actions }))}"${_scopeId}>`);
													(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "actions", {
														files: modelValue.value,
														open: (0, vue_exports.unref)(open),
														removeFile
													}, null, _push, _parent, _scopeId);
													_push(`</div>`);
												} else _push(`<!---->`);
												_push(`<!--]-->`);
											} else _push(`<!---->`);
											_push(`</div>`);
										} else _push(`<!---->`);
									} else return [position.value === "inside" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseFilesTemplate), { key: 0 })) : (0, vue_exports.createCommentVNode)("", true), (position.value === "inside" ? !(0, vue_exports.unref)(props).preview || ((0, vue_exports.unref)(multiple) ? !modelValue.value?.length : !modelValue.value) : true) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 1,
										"data-slot": "wrapper",
										class: ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper })
									}, [(0, vue_exports.renderSlot)(_ctx.$slots, "leading", { ui: ui.value }, () => [(0, vue_exports.unref)(props).icon !== false ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [variant.value === "button" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
										key: 0,
										name: (0, vue_exports.unref)(props).icon ?? (0, vue_exports.unref)(appConfig).ui.icons.upload,
										"data-slot": "icon",
										class: ui.value.icon({ class: (0, vue_exports.unref)(props).ui?.icon })
									}, null, 8, ["name", "class"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, {
										key: 1,
										icon: (0, vue_exports.unref)(props).icon ?? (0, vue_exports.unref)(appConfig).ui.icons.upload,
										size: size.value,
										"data-slot": "avatar",
										class: ui.value.avatar({ class: (0, vue_exports.unref)(props).ui?.avatar })
									}, null, 8, [
										"icon",
										"size",
										"class"
									]))], 64)) : (0, vue_exports.createCommentVNode)("", true)]), variant.value !== "button" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [
										(0, vue_exports.unref)(props).label || !!slots.label ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 0,
											"data-slot": "label",
											class: ui.value.label({ class: (0, vue_exports.unref)(props).ui?.label })
										}, [(0, vue_exports.renderSlot)(_ctx.$slots, "label", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).label), 1)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
										(0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 1,
											"data-slot": "description",
											class: ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description })
										}, [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
										!!slots.actions ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 2,
											"data-slot": "actions",
											class: ui.value.actions({ class: (0, vue_exports.unref)(props).ui?.actions })
										}, [(0, vue_exports.renderSlot)(_ctx.$slots, "actions", {
											files: modelValue.value,
											open: (0, vue_exports.unref)(open),
											removeFile
										})], 2)) : (0, vue_exports.createCommentVNode)("", true)
									], 64)) : (0, vue_exports.createCommentVNode)("", true)], 2)) : (0, vue_exports.createCommentVNode)("", true)];
								}),
								_: 3
							}), _parent, _scopeId);
							if (position.value === "outside") _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseFilesTemplate), null, null, _parent, _scopeId));
							else _push(`<!---->`);
						}, _push, _parent, _scopeId);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(VisuallyHidden_default), (0, vue_exports.mergeProps)({
							id: (0, vue_exports.unref)(id),
							ref_key: "inputRef",
							ref: inputRef,
							as: "input",
							type: "file",
							feature: "fully-hidden",
							name: (0, vue_exports.unref)(name),
							accept: (0, vue_exports.unref)(accept),
							multiple: (0, vue_exports.unref)(multiple),
							required: (0, vue_exports.unref)(props).required,
							disabled: disabled.value
						}, {
							..._ctx.$attrs,
							...(0, vue_exports.unref)(ariaAttrs),
							"data-slot": void 0
						}), null, _parent, _scopeId));
					} else return [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {
						open: (0, vue_exports.unref)(open),
						removeFile,
						ui: ui.value
					}, () => [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.resolveDynamicComponent)(variant.value === "button" ? "button" : "div"), {
						ref_key: "dropzoneRef",
						ref: dropzoneRef,
						type: variant.value === "button" ? "button" : void 0,
						role: variant.value === "button" ? void 0 : "button",
						disabled: variant.value === "button" ? disabled.value : void 0,
						"aria-disabled": variant.value === "button" ? void 0 : disabled.value || void 0,
						"data-dragging": (0, vue_exports.unref)(isDragging),
						"data-slot": "base",
						class: ui.value.base({ class: (0, vue_exports.unref)(props).ui?.base }),
						tabindex: (0, vue_exports.unref)(props).interactive && !disabled.value ? 0 : -1,
						onClick: ($event) => (0, vue_exports.unref)(props).interactive && !disabled.value && (0, vue_exports.unref)(open)(),
						onKeydown: (0, vue_exports.withKeys)((0, vue_exports.withModifiers)(() => {}, ["prevent"]), ["space"]),
						onKeyup: (0, vue_exports.withKeys)(($event) => (0, vue_exports.unref)(props).interactive && !disabled.value && (0, vue_exports.unref)(open)(), ["enter", "space"])
					}, {
						default: (0, vue_exports.withCtx)(() => [position.value === "inside" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseFilesTemplate), { key: 0 })) : (0, vue_exports.createCommentVNode)("", true), (position.value === "inside" ? !(0, vue_exports.unref)(props).preview || ((0, vue_exports.unref)(multiple) ? !modelValue.value?.length : !modelValue.value) : true) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 1,
							"data-slot": "wrapper",
							class: ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper })
						}, [(0, vue_exports.renderSlot)(_ctx.$slots, "leading", { ui: ui.value }, () => [(0, vue_exports.unref)(props).icon !== false ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [variant.value === "button" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
							key: 0,
							name: (0, vue_exports.unref)(props).icon ?? (0, vue_exports.unref)(appConfig).ui.icons.upload,
							"data-slot": "icon",
							class: ui.value.icon({ class: (0, vue_exports.unref)(props).ui?.icon })
						}, null, 8, ["name", "class"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, {
							key: 1,
							icon: (0, vue_exports.unref)(props).icon ?? (0, vue_exports.unref)(appConfig).ui.icons.upload,
							size: size.value,
							"data-slot": "avatar",
							class: ui.value.avatar({ class: (0, vue_exports.unref)(props).ui?.avatar })
						}, null, 8, [
							"icon",
							"size",
							"class"
						]))], 64)) : (0, vue_exports.createCommentVNode)("", true)]), variant.value !== "button" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [
							(0, vue_exports.unref)(props).label || !!slots.label ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								"data-slot": "label",
								class: ui.value.label({ class: (0, vue_exports.unref)(props).ui?.label })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "label", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).label), 1)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
							(0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 1,
								"data-slot": "description",
								class: ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
							!!slots.actions ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 2,
								"data-slot": "actions",
								class: ui.value.actions({ class: (0, vue_exports.unref)(props).ui?.actions })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "actions", {
								files: modelValue.value,
								open: (0, vue_exports.unref)(open),
								removeFile
							})], 2)) : (0, vue_exports.createCommentVNode)("", true)
						], 64)) : (0, vue_exports.createCommentVNode)("", true)], 2)) : (0, vue_exports.createCommentVNode)("", true)]),
						_: 3
					}, 40, [
						"type",
						"role",
						"disabled",
						"aria-disabled",
						"data-dragging",
						"class",
						"tabindex",
						"onClick",
						"onKeydown",
						"onKeyup"
					])), position.value === "outside" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseFilesTemplate), { key: 0 })) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.createVNode)((0, vue_exports.unref)(VisuallyHidden_default), (0, vue_exports.mergeProps)({
						id: (0, vue_exports.unref)(id),
						ref_key: "inputRef",
						ref: inputRef,
						as: "input",
						type: "file",
						feature: "fully-hidden",
						name: (0, vue_exports.unref)(name),
						accept: (0, vue_exports.unref)(accept),
						multiple: (0, vue_exports.unref)(multiple),
						required: (0, vue_exports.unref)(props).required,
						disabled: disabled.value
					}, {
						..._ctx.$attrs,
						...(0, vue_exports.unref)(ariaAttrs),
						"data-slot": void 0
					}), null, 16, [
						"id",
						"name",
						"accept",
						"multiple",
						"required",
						"disabled"
					])];
				}),
				_: 3
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/FileUpload.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main$1 as _, _sfc_main as a };
//# sourceMappingURL=FileUpload-Bhdgt3US.mjs.map
