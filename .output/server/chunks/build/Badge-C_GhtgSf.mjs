import { v as vue_exports, x as useVModel, H as useEmitAsProps, w as useForwardExpose, A as Presence_default, P as Primitive, T as Teleport_default, c as useComponentProps, e as useAppConfig, i as useFieldGroup, j as useComponentIcons, t as tv, s as server_renderer_exports, b as _sfc_main$5, o as _sfc_main$3, B as createContext } from '../virtual/entry.mjs';
import { b as useId, d as useHideOthers, c as useBodyScrollLock, F as FocusScope_default, D as DismissableLayer_default } from './fetch-DCvyPg_e.mjs';

//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogRoot.js
var [injectDialogRootContext, provideDialogRootContext] = /*#__PURE__*/ createContext("DialogRoot");
var DialogRoot_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	inheritAttrs: false,
	__name: "DialogRoot",
	props: {
		open: {
			type: Boolean,
			required: false,
			default: void 0
		},
		defaultOpen: {
			type: Boolean,
			required: false,
			default: false
		},
		modal: {
			type: Boolean,
			required: false,
			default: true
		},
		unmountOnHide: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	emits: ["update:open"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const open = useVModel(props, "open", __emit, {
			defaultValue: props.defaultOpen,
			passive: props.open === void 0
		});
		const triggerElement = (0, vue_exports.ref)();
		const contentElement = (0, vue_exports.ref)();
		const { modal, unmountOnHide } = (0, vue_exports.toRefs)(props);
		provideDialogRootContext({
			open,
			modal,
			unmountOnHide,
			openModal: () => {
				open.value = true;
			},
			onOpenChange: (value) => {
				open.value = value;
			},
			onOpenToggle: () => {
				open.value = !open.value;
			},
			contentId: "",
			titleId: "",
			descriptionId: "",
			triggerElement,
			contentElement
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.renderSlot)(_ctx.$slots, "default", {
				open: (0, vue_exports.unref)(open),
				close: () => open.value = false
			});
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogClose.js
var DialogClose_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogClose",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "button"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		const rootContext = injectDialogRootContext();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, {
				type: _ctx.as === "button" ? "button" : void 0,
				onClick: _cache[0] || (_cache[0] = ($event) => (0, vue_exports.unref)(rootContext).onOpenChange(false))
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["type"]);
		};
	}
});
function getOpenState(open) {
	return open ? "open" : "closed";
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogContentImpl.js
var DialogContentImpl_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogContentImpl",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		trapFocus: {
			type: Boolean,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		present: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectDialogRootContext();
		const { forwardRef} = useForwardExpose();
		rootContext.titleId ||= useId(void 0, "reka-dialog-title");
		rootContext.descriptionId ||= useId(void 0, "reka-dialog-description");
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(FocusScope_default), {
				"as-child": "",
				loop: "",
				trapped: props.trapFocus,
				present: props.present,
				onMountAutoFocus: _cache[5] || (_cache[5] = ($event) => emits("openAutoFocus", $event)),
				onUnmountAutoFocus: _cache[6] || (_cache[6] = ($event) => emits("closeAutoFocus", $event))
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(DismissableLayer_default), (0, vue_exports.mergeProps)({
					id: (0, vue_exports.unref)(rootContext).contentId,
					ref: (0, vue_exports.unref)(forwardRef),
					as: _ctx.as,
					"as-child": _ctx.asChild,
					present: props.present,
					"disable-outside-pointer-events": _ctx.disableOutsidePointerEvents,
					role: "dialog",
					"aria-describedby": (0, vue_exports.unref)(rootContext).descriptionId,
					"aria-labelledby": (0, vue_exports.unref)(rootContext).titleId,
					"data-state": (0, vue_exports.unref)(getOpenState)((0, vue_exports.unref)(rootContext).open.value)
				}, _ctx.$attrs, {
					onDismiss: _cache[0] || (_cache[0] = ($event) => (0, vue_exports.unref)(rootContext).onOpenChange(false)),
					onEscapeKeyDown: _cache[1] || (_cache[1] = ($event) => emits("escapeKeyDown", $event)),
					onFocusOutside: _cache[2] || (_cache[2] = ($event) => emits("focusOutside", $event)),
					onInteractOutside: _cache[3] || (_cache[3] = ($event) => emits("interactOutside", $event)),
					onPointerDownOutside: _cache[4] || (_cache[4] = ($event) => emits("pointerDownOutside", $event))
				}), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 16, [
					"id",
					"as",
					"as-child",
					"present",
					"disable-outside-pointer-events",
					"aria-describedby",
					"aria-labelledby",
					"data-state"
				])]),
				_: 3
			}, 8, ["trapped", "present"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogContentModal.js
var DialogContentModal_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogContentModal",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		trapFocus: {
			type: Boolean,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false,
			default: true
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		present: {
			type: Boolean,
			required: true
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectDialogRootContext();
		const emitsAsProps = useEmitAsProps(emits);
		const { forwardRef, currentElement } = useForwardExpose();
		const ariaHiddenTarget = (0, vue_exports.computed)(() => props.present ? currentElement.value : void 0);
		useHideOthers(ariaHiddenTarget);
		const forwardedProps = (0, vue_exports.computed)(() => {
			const { present: _, ...rest } = props;
			return rest;
		});
		(0, vue_exports.watch)(() => props.present, (isPresent, wasPresent) => {
			if (!isPresent && wasPresent) rootContext.triggerElement.value?.focus();
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(DialogContentImpl_default, (0, vue_exports.mergeProps)({
				...forwardedProps.value,
				...(0, vue_exports.unref)(emitsAsProps)
			}, {
				ref: (0, vue_exports.unref)(forwardRef),
				present: _ctx.present,
				"trap-focus": (0, vue_exports.unref)(rootContext).open.value,
				"disable-outside-pointer-events": props.disableOutsidePointerEvents,
				onCloseAutoFocus: _cache[0] || (_cache[0] = (event) => {
					if (!event.defaultPrevented) {
						event.preventDefault();
						(0, vue_exports.unref)(rootContext).triggerElement.value?.focus();
					}
				}),
				onPointerDownOutside: _cache[1] || (_cache[1] = (event) => {
					const originalEvent = event.detail.originalEvent;
					const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
					if (originalEvent.button === 2 || ctrlLeftClick) event.preventDefault();
				}),
				onFocusOutside: _cache[2] || (_cache[2] = (event) => {
					event.preventDefault();
				})
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"present",
				"trap-focus",
				"disable-outside-pointer-events"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogContentNonModal.js
var DialogContentNonModal_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogContentNonModal",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		trapFocus: {
			type: Boolean,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		present: {
			type: Boolean,
			required: true
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emitsAsProps = useEmitAsProps(__emit);
		useForwardExpose();
		const rootContext = injectDialogRootContext();
		const hasInteractedOutsideRef = (0, vue_exports.ref)(false);
		const hasPointerDownOutsideRef = (0, vue_exports.ref)(false);
		const forwardedProps = (0, vue_exports.computed)(() => {
			const { present: _, ...rest } = props;
			return rest;
		});
		(0, vue_exports.watch)(() => props.present, (isPresent, wasPresent) => {
			if (!isPresent && wasPresent) {
				if (!hasInteractedOutsideRef.value) rootContext.triggerElement.value?.focus();
				hasInteractedOutsideRef.value = false;
				hasPointerDownOutsideRef.value = false;
			}
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(DialogContentImpl_default, (0, vue_exports.mergeProps)({
				...forwardedProps.value,
				...(0, vue_exports.unref)(emitsAsProps)
			}, {
				present: _ctx.present,
				"trap-focus": false,
				"disable-outside-pointer-events": false,
				onCloseAutoFocus: _cache[0] || (_cache[0] = (event) => {
					if (!event.defaultPrevented) {
						if (!hasInteractedOutsideRef.value) (0, vue_exports.unref)(rootContext).triggerElement.value?.focus();
						event.preventDefault();
					}
					hasInteractedOutsideRef.value = false;
					hasPointerDownOutsideRef.value = false;
				}),
				onInteractOutside: _cache[1] || (_cache[1] = (event) => {
					if (!event.defaultPrevented) {
						hasInteractedOutsideRef.value = true;
						if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.value = true;
					}
					const target = event.target;
					if ((0, vue_exports.unref)(rootContext).triggerElement.value?.contains(target)) event.preventDefault();
					if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.value) event.preventDefault();
				})
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["present"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogContent.js
var DialogContent_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogContent",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false,
			default: void 0
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectDialogRootContext();
		const emitsAsProps = useEmitAsProps(emits);
		const { forwardRef } = useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Presence_default), {
				present: _ctx.forceMount || (0, vue_exports.unref)(rootContext).open.value,
				"force-mount": _ctx.forceMount || !(0, vue_exports.unref)(rootContext).unmountOnHide.value
			}, {
				default: (0, vue_exports.withCtx)(({ present }) => [(0, vue_exports.unref)(rootContext).modal.value ? (0, vue_exports.withDirectives)(((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(DialogContentModal_default, (0, vue_exports.mergeProps)({
					key: 0,
					ref: (0, vue_exports.unref)(forwardRef),
					present: (0, vue_exports.unref)(rootContext).unmountOnHide.value || present
				}, {
					...props,
					...(0, vue_exports.unref)(emitsAsProps),
					..._ctx.$attrs
				}), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 2
				}, 1040, ["present"])), [[vue_exports.vShow, (0, vue_exports.unref)(rootContext).unmountOnHide.value || present]]) : (0, vue_exports.withDirectives)(((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(DialogContentNonModal_default, (0, vue_exports.mergeProps)({
					key: 1,
					ref: (0, vue_exports.unref)(forwardRef),
					present: (0, vue_exports.unref)(rootContext).unmountOnHide.value || present
				}, {
					...props,
					...(0, vue_exports.unref)(emitsAsProps),
					..._ctx.$attrs
				}), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 2
				}, 1040, ["present"])), [[vue_exports.vShow, (0, vue_exports.unref)(rootContext).unmountOnHide.value || present]])]),
				_: 3
			}, 8, ["present", "force-mount"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogDescription.js
var DialogDescription_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogDescription",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "p"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		const rootContext = injectDialogRootContext();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, { id: (0, vue_exports.unref)(rootContext).descriptionId }), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["id"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogOverlayImpl.js
var DialogOverlayImpl_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogOverlayImpl",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		present: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectDialogRootContext();
		const scrollLocked = useBodyScrollLock(props.present);
		(0, vue_exports.watch)(() => props.present, (val) => scrollLocked.value = val);
		useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), {
				as: _ctx.as,
				"as-child": _ctx.asChild,
				"data-state": (0, vue_exports.unref)(rootContext).open.value ? "open" : "closed",
				style: { "pointer-events": "auto" },
				onPointerdown: _cache[0] || (_cache[0] = (0, vue_exports.withModifiers)(() => {}, [
					"left",
					"self",
					"prevent"
				]))
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"as",
				"as-child",
				"data-state"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogOverlay.js
var DialogOverlay_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogOverlay",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const rootContext = injectDialogRootContext();
		const { forwardRef } = useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.unref)(rootContext)?.modal.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Presence_default), {
				key: 0,
				present: _ctx.forceMount || (0, vue_exports.unref)(rootContext).open.value,
				"force-mount": _ctx.forceMount || !(0, vue_exports.unref)(rootContext).unmountOnHide.value
			}, {
				default: (0, vue_exports.withCtx)(({ present }) => [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)(DialogOverlayImpl_default, (0, vue_exports.mergeProps)(_ctx.$attrs, {
					ref: (0, vue_exports.unref)(forwardRef),
					as: _ctx.as,
					"as-child": _ctx.asChild,
					present: (0, vue_exports.unref)(rootContext).unmountOnHide.value || present
				}), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 2
				}, 1040, [
					"as",
					"as-child",
					"present"
				]), [[vue_exports.vShow, (0, vue_exports.unref)(rootContext).unmountOnHide.value || present]])]),
				_: 3
			}, 8, ["present", "force-mount"])) : (0, vue_exports.createCommentVNode)("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogPortal.js
var DialogPortal_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogPortal",
	props: {
		to: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		defer: {
			type: Boolean,
			required: false
		},
		forceMount: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Teleport_default), (0, vue_exports.normalizeProps)((0, vue_exports.guardReactiveProps)(props)), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogTitle.js
var DialogTitle_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogTitle",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "h2"
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectDialogRootContext();
		useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, { id: (0, vue_exports.unref)(rootContext).titleId }), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["id"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogTrigger.js
var DialogTrigger_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogTrigger",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "button"
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectDialogRootContext();
		const { forwardRef} = useForwardExpose();
		rootContext.contentId ||= useId(void 0, "reka-dialog-content");
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, {
				ref: (0, vue_exports.unref)(forwardRef),
				type: _ctx.as === "button" ? "button" : void 0,
				"aria-haspopup": "dialog",
				"aria-expanded": (0, vue_exports.unref)(rootContext).open.value || false,
				"aria-controls": (0, vue_exports.unref)(rootContext).open.value ? (0, vue_exports.unref)(rootContext).contentId : void 0,
				"data-state": (0, vue_exports.unref)(rootContext).open.value ? "open" : "closed",
				onClick: (0, vue_exports.unref)(rootContext).onOpenToggle
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"type",
				"aria-expanded",
				"aria-controls",
				"data-state",
				"onClick"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/utils/overlay.js
function pointerDownOutside(e, options = {}) {
	const originalEvent = e.detail.originalEvent;
	const target = originalEvent.target;
	if (!target?.isConnected) {
		e.preventDefault();
		return;
	}
	if (options.scrollable) {
		if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) e.preventDefault();
	}
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fbadge.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fbadge_default = {
	"slots": {
		"base": "font-medium inline-flex items-center",
		"label": "truncate",
		"leadingIcon": "shrink-0",
		"leadingAvatar": "shrink-0",
		"leadingAvatarSize": "",
		"trailingIcon": "shrink-0"
	},
	"variants": {
		"fieldGroup": {
			"horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
			"vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
		},
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
			"solid": "",
			"outline": "",
			"soft": "",
			"subtle": ""
		},
		"size": {
			"xs": {
				"base": "text-[8px]/3 px-1 py-0.5 gap-1 rounded-sm",
				"leadingIcon": "size-3",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-3"
			},
			"sm": {
				"base": "text-[10px]/3 px-1.5 py-1 gap-1 rounded-sm",
				"leadingIcon": "size-3",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-3"
			},
			"md": {
				"base": "text-xs px-2 py-1 gap-1 rounded-md",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"lg": {
				"base": "text-sm px-2 py-1 gap-1.5 rounded-md",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"xl": {
				"base": "text-base px-2.5 py-1 gap-1.5 rounded-md",
				"leadingIcon": "size-6",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-6"
			}
		},
		"square": { "true": "" }
	},
	"compoundVariants": [
		{
			"color": "primary",
			"variant": "solid",
			"class": "bg-primary text-inverted"
		},
		{
			"color": "secondary",
			"variant": "solid",
			"class": "bg-secondary text-inverted"
		},
		{
			"color": "success",
			"variant": "solid",
			"class": "bg-success text-inverted"
		},
		{
			"color": "info",
			"variant": "solid",
			"class": "bg-info text-inverted"
		},
		{
			"color": "warning",
			"variant": "solid",
			"class": "bg-warning text-inverted"
		},
		{
			"color": "error",
			"variant": "solid",
			"class": "bg-error text-inverted"
		},
		{
			"color": "primary",
			"variant": "outline",
			"class": "text-primary ring ring-inset ring-primary/50"
		},
		{
			"color": "secondary",
			"variant": "outline",
			"class": "text-secondary ring ring-inset ring-secondary/50"
		},
		{
			"color": "success",
			"variant": "outline",
			"class": "text-success ring ring-inset ring-success/50"
		},
		{
			"color": "info",
			"variant": "outline",
			"class": "text-info ring ring-inset ring-info/50"
		},
		{
			"color": "warning",
			"variant": "outline",
			"class": "text-warning ring ring-inset ring-warning/50"
		},
		{
			"color": "error",
			"variant": "outline",
			"class": "text-error ring ring-inset ring-error/50"
		},
		{
			"color": "primary",
			"variant": "soft",
			"class": "bg-primary/10 text-primary"
		},
		{
			"color": "secondary",
			"variant": "soft",
			"class": "bg-secondary/10 text-secondary"
		},
		{
			"color": "success",
			"variant": "soft",
			"class": "bg-success/10 text-success"
		},
		{
			"color": "info",
			"variant": "soft",
			"class": "bg-info/10 text-info"
		},
		{
			"color": "warning",
			"variant": "soft",
			"class": "bg-warning/10 text-warning"
		},
		{
			"color": "error",
			"variant": "soft",
			"class": "bg-error/10 text-error"
		},
		{
			"color": "primary",
			"variant": "subtle",
			"class": "bg-primary/10 text-primary ring ring-inset ring-primary/25"
		},
		{
			"color": "secondary",
			"variant": "subtle",
			"class": "bg-secondary/10 text-secondary ring ring-inset ring-secondary/25"
		},
		{
			"color": "success",
			"variant": "subtle",
			"class": "bg-success/10 text-success ring ring-inset ring-success/25"
		},
		{
			"color": "info",
			"variant": "subtle",
			"class": "bg-info/10 text-info ring ring-inset ring-info/25"
		},
		{
			"color": "warning",
			"variant": "subtle",
			"class": "bg-warning/10 text-warning ring ring-inset ring-warning/25"
		},
		{
			"color": "error",
			"variant": "subtle",
			"class": "bg-error/10 text-error ring ring-inset ring-error/25"
		},
		{
			"color": "neutral",
			"variant": "solid",
			"class": "text-inverted bg-inverted"
		},
		{
			"color": "neutral",
			"variant": "outline",
			"class": "ring ring-inset ring-accented text-default bg-default"
		},
		{
			"color": "neutral",
			"variant": "soft",
			"class": "text-default bg-elevated"
		},
		{
			"color": "neutral",
			"variant": "subtle",
			"class": "ring ring-inset ring-accented text-default bg-elevated"
		},
		{
			"size": "xs",
			"square": true,
			"class": "p-0.5"
		},
		{
			"size": "sm",
			"square": true,
			"class": "p-1"
		},
		{
			"size": "md",
			"square": true,
			"class": "p-1"
		},
		{
			"size": "lg",
			"square": true,
			"class": "p-1"
		},
		{
			"size": "xl",
			"square": true,
			"class": "p-1"
		}
	],
	"defaultVariants": {
		"color": "primary",
		"variant": "solid",
		"size": "md"
	}
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/Badge.vue
var _sfc_main = {
	__name: "UBadge",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false,
			default: "span"
		},
		label: {
			type: [String, Number],
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
		square: {
			type: Boolean,
			required: false
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		icon: {
			type: null,
			required: false
		},
		avatar: {
			type: Object,
			required: false
		},
		leading: {
			type: Boolean,
			required: false
		},
		leadingIcon: {
			type: null,
			required: false
		},
		trailing: {
			type: Boolean,
			required: false
		},
		trailingIcon: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const _props = __props;
		const slots = (0, vue_exports.useSlots)();
		const props = useComponentProps("badge", _props);
		const appConfig = useAppConfig();
		const { orientation, size: fieldGroupSize } = useFieldGroup(_props);
		const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fbadge_default,
			...appConfig.ui?.badge || {}
		})({
			color: props.color,
			variant: props.variant,
			size: fieldGroupSize.value ?? props.size,
			square: props.square || !slots.default && !props.label,
			fieldGroup: orientation.value
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
				as: (0, vue_exports.unref)(props).as,
				"data-slot": "base",
				class: ui.value.base({ class: [(0, vue_exports.unref)(props).ui?.base, (0, vue_exports.unref)(props).class] })
			}, _attrs), {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "leading", { ui: ui.value }, () => {
							if ((0, vue_exports.unref)(isLeading) && (0, vue_exports.unref)(leadingIconName)) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$5, {
								name: (0, vue_exports.unref)(leadingIconName),
								"data-slot": "leadingIcon",
								class: ui.value.leadingIcon({ class: (0, vue_exports.unref)(props).ui?.leadingIcon })
							}, null, _parent, _scopeId));
							else if (!!(0, vue_exports.unref)(props).avatar) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$3, (0, vue_exports.mergeProps)({ size: (0, vue_exports.unref)(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize() }, (0, vue_exports.unref)(props).avatar, {
								"data-slot": "leadingAvatar",
								class: ui.value.leadingAvatar({ class: (0, vue_exports.unref)(props).ui?.leadingAvatar })
							}), null, _parent, _scopeId));
							else _push(`<!---->`);
						}, _push, _parent, _scopeId);
						(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", { ui: ui.value }, () => {
							if ((0, vue_exports.unref)(props).label !== void 0 && (0, vue_exports.unref)(props).label !== null) _push(`<span data-slot="label" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.label({ class: (0, vue_exports.unref)(props).ui?.label }))}"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).label)}</span>`);
							else _push(`<!---->`);
						}, _push, _parent, _scopeId);
						(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "trailing", { ui: ui.value }, () => {
							if ((0, vue_exports.unref)(isTrailing) && (0, vue_exports.unref)(trailingIconName)) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$5, {
								name: (0, vue_exports.unref)(trailingIconName),
								"data-slot": "trailingIcon",
								class: ui.value.trailingIcon({ class: (0, vue_exports.unref)(props).ui?.trailingIcon })
							}, null, _parent, _scopeId));
							else _push(`<!---->`);
						}, _push, _parent, _scopeId);
					} else return [
						(0, vue_exports.renderSlot)(_ctx.$slots, "leading", { ui: ui.value }, () => [(0, vue_exports.unref)(isLeading) && (0, vue_exports.unref)(leadingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
							key: 0,
							name: (0, vue_exports.unref)(leadingIconName),
							"data-slot": "leadingIcon",
							class: ui.value.leadingIcon({ class: (0, vue_exports.unref)(props).ui?.leadingIcon })
						}, null, 8, ["name", "class"])) : !!(0, vue_exports.unref)(props).avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
							key: 1,
							size: (0, vue_exports.unref)(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
						}, (0, vue_exports.unref)(props).avatar, {
							"data-slot": "leadingAvatar",
							class: ui.value.leadingAvatar({ class: (0, vue_exports.unref)(props).ui?.leadingAvatar })
						}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)]),
						(0, vue_exports.renderSlot)(_ctx.$slots, "default", { ui: ui.value }, () => [(0, vue_exports.unref)(props).label !== void 0 && (0, vue_exports.unref)(props).label !== null ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
							key: 0,
							"data-slot": "label",
							class: ui.value.label({ class: (0, vue_exports.unref)(props).ui?.label })
						}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).label), 3)) : (0, vue_exports.createCommentVNode)("", true)]),
						(0, vue_exports.renderSlot)(_ctx.$slots, "trailing", { ui: ui.value }, () => [(0, vue_exports.unref)(isTrailing) && (0, vue_exports.unref)(trailingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
							key: 0,
							name: (0, vue_exports.unref)(trailingIconName),
							"data-slot": "trailingIcon",
							class: ui.value.trailingIcon({ class: (0, vue_exports.unref)(props).ui?.trailingIcon })
						}, null, 8, ["name", "class"])) : (0, vue_exports.createCommentVNode)("", true)])
					];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/Badge.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { DialogRoot_default as D, _sfc_main as _, DialogTrigger_default as a, DialogPortal_default as b, DialogOverlay_default as c, DialogContent_default as d, DialogTitle_default as e, DialogDescription_default as f, DialogClose_default as g, pointerDownOutside as p };
//# sourceMappingURL=Badge-C_GhtgSf.mjs.map
