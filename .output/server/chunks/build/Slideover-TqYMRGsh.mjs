import { v as vue_exports, c as useComponentProps, d as useLocale, e as useAppConfig, f as useForwardProps, r as reactivePick, g as usePortal, t as tv, s as server_renderer_exports, F as FieldGroupReset, V as VisuallyHidden_default, a as _sfc_main$3, ab as injectTooltipProviderContext, w as useForwardExpose, x as useVModel, ac as useTimeoutFn, P as Primitive, T as Teleport_default, A as Presence_default, B as createContext, G as useForwardProps$1, aa as createSharedComposable, J as refAutoReset, ad as tryOnScopeDispose, E as createEventHook } from '../virtual/entry.mjs';
import { P as PopperRoot_default, a as PopperAnchor_default, u as useForwardPropsEmits, b as PopperArrow_default, c as PopperContent_default } from './SelectMenu-DtagK2wf.mjs';
import { b as useId, D as DismissableLayer_default } from './fetch-DCvyPg_e.mjs';
import { p as pointerDownOutside, D as DialogRoot_default, a as DialogTrigger_default, b as DialogPortal_default, c as DialogOverlay_default, d as DialogContent_default, e as DialogTitle_default, f as DialogDescription_default, g as DialogClose_default } from './Badge-C_GhtgSf.mjs';
import { I as defu } from '../_/nitro.mjs';

//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useGraceArea.js
function useGraceArea(triggerElement, containerElement) {
	const isPointerInTransit = refAutoReset(false, 300);
	tryOnScopeDispose(() => {
		isPointerInTransit.value = false;
	});
	const pointerGraceArea = (0, vue_exports.ref)(null);
	const pointerExit = createEventHook();
	function handleRemoveGraceArea() {
		pointerGraceArea.value = null;
		isPointerInTransit.value = false;
	}
	function handleCreateGraceArea(event, hoverTarget) {
		if (!hoverTarget) return;
		const currentTarget = event.currentTarget;
		const exitPoint = {
			x: event.clientX,
			y: event.clientY
		};
		const paddedExitPoints = getPaddedExitPoints(exitPoint, getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect()), 1);
		const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
		const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
		pointerGraceArea.value = graceArea;
		isPointerInTransit.value = true;
	}
	(0, vue_exports.watchEffect)((cleanupFn) => {
		if (triggerElement.value && containerElement.value) {
			const handleTriggerLeave = (event) => handleCreateGraceArea(event, containerElement.value);
			const handleContentLeave = (event) => handleCreateGraceArea(event, triggerElement.value);
			triggerElement.value.addEventListener("pointerleave", handleTriggerLeave);
			containerElement.value.addEventListener("pointerleave", handleContentLeave);
			cleanupFn(() => {
				triggerElement.value?.removeEventListener("pointerleave", handleTriggerLeave);
				containerElement.value?.removeEventListener("pointerleave", handleContentLeave);
			});
		}
	});
	(0, vue_exports.watchEffect)((cleanupFn) => {
		if (pointerGraceArea.value) {
			const handleTrackPointerGrace = (event) => {
				if (!pointerGraceArea.value || !(event.target instanceof Element)) return;
				const target = event.target;
				const pointerPosition = {
					x: event.clientX,
					y: event.clientY
				};
				const hasEnteredTarget = triggerElement.value?.contains(target) || containerElement.value?.contains(target);
				const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea.value);
				const isAnotherGraceAreaTrigger = !!target.closest("[data-grace-area-trigger]");
				if (hasEnteredTarget) handleRemoveGraceArea();
				else if (isPointerOutsideGraceArea || isAnotherGraceAreaTrigger) {
					handleRemoveGraceArea();
					pointerExit.trigger();
				}
			};
			triggerElement.value?.ownerDocument.addEventListener("pointermove", handleTrackPointerGrace);
			cleanupFn(() => triggerElement.value?.ownerDocument.removeEventListener("pointermove", handleTrackPointerGrace));
		}
	});
	return {
		isPointerInTransit,
		onPointerExit: pointerExit.on
	};
}
function getExitSideFromRect(point, rect) {
	const top = Math.abs(rect.top - point.y);
	const bottom = Math.abs(rect.bottom - point.y);
	const right = Math.abs(rect.right - point.x);
	const left = Math.abs(rect.left - point.x);
	switch (Math.min(top, bottom, right, left)) {
		case left: return "left";
		case right: return "right";
		case top: return "top";
		case bottom: return "bottom";
		default: throw new Error("unreachable");
	}
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
	const paddedExitPoints = [];
	switch (exitSide) {
		case "top":
			paddedExitPoints.push({
				x: exitPoint.x - padding,
				y: exitPoint.y + padding
			}, {
				x: exitPoint.x + padding,
				y: exitPoint.y + padding
			});
			break;
		case "bottom":
			paddedExitPoints.push({
				x: exitPoint.x - padding,
				y: exitPoint.y - padding
			}, {
				x: exitPoint.x + padding,
				y: exitPoint.y - padding
			});
			break;
		case "left":
			paddedExitPoints.push({
				x: exitPoint.x + padding,
				y: exitPoint.y - padding
			}, {
				x: exitPoint.x + padding,
				y: exitPoint.y + padding
			});
			break;
		case "right": paddedExitPoints.push({
			x: exitPoint.x - padding,
			y: exitPoint.y - padding
		}, {
			x: exitPoint.x - padding,
			y: exitPoint.y + padding
		});
	}
	return paddedExitPoints;
}
function getPointsFromRect(rect) {
	const { top, right, bottom, left } = rect;
	return [
		{
			x: left,
			y: top
		},
		{
			x: right,
			y: top
		},
		{
			x: right,
			y: bottom
		},
		{
			x: left,
			y: bottom
		}
	];
}
function isPointInPolygon(point, polygon) {
	const { x, y } = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i].x;
		const yi = polygon[i].y;
		const xj = polygon[j].x;
		const yj = polygon[j].y;
		if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}
function getHull(points) {
	const newPoints = points.slice();
	newPoints.sort((a, b) => {
		if (a.x < b.x) return -1;
		else if (a.x > b.x) return 1;
		else if (a.y < b.y) return -1;
		else if (a.y > b.y) return 1;
		else return 0;
	});
	return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
	if (points.length <= 1) return points.slice();
	const upperHull = [];
	for (let i = 0; i < points.length; i++) {
		const p = points[i];
		while (upperHull.length >= 2) {
			const q = upperHull.at(-1);
			const r = upperHull[upperHull.length - 2];
			if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
			else break;
		}
		upperHull.push(p);
	}
	upperHull.pop();
	const lowerHull = [];
	for (let i = points.length - 1; i >= 0; i--) {
		const p = points[i];
		while (lowerHull.length >= 2) {
			const q = lowerHull.at(-1);
			const r = lowerHull[lowerHull.length - 2];
			if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
			else break;
		}
		lowerHull.push(p);
	}
	lowerHull.pop();
	if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) return upperHull;
	else return upperHull.concat(lowerHull);
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Tooltip/TooltipArrow.js
var TooltipArrow_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "TooltipArrow",
	props: {
		width: {
			type: Number,
			required: false,
			default: 10
		},
		height: {
			type: Number,
			required: false,
			default: 5
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "svg"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(PopperArrow_default), (0, vue_exports.normalizeProps)((0, vue_exports.guardReactiveProps)(props)), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Tooltip/utils.js
var TOOLTIP_OPEN = "tooltip.open";
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Tooltip/TooltipRoot.js
var [injectTooltipRootContext, provideTooltipRootContext] = /*#__PURE__*/ createContext("TooltipRoot");
var TooltipRoot_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "TooltipRoot",
	props: {
		defaultOpen: {
			type: Boolean,
			required: false,
			default: false
		},
		open: {
			type: Boolean,
			required: false,
			default: void 0
		},
		delayDuration: {
			type: Number,
			required: false,
			default: void 0
		},
		disableHoverableContent: {
			type: Boolean,
			required: false,
			default: void 0
		},
		disableClosingTrigger: {
			type: Boolean,
			required: false,
			default: void 0
		},
		disabled: {
			type: Boolean,
			required: false,
			default: void 0
		},
		ignoreNonKeyboardFocus: {
			type: Boolean,
			required: false,
			default: void 0
		}
	},
	emits: ["update:open"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		useForwardExpose();
		const providerContext = injectTooltipProviderContext();
		const disableHoverableContent = (0, vue_exports.computed)(() => props.disableHoverableContent ?? providerContext.disableHoverableContent.value);
		const disableClosingTrigger = (0, vue_exports.computed)(() => props.disableClosingTrigger ?? providerContext.disableClosingTrigger.value);
		const disableTooltip = (0, vue_exports.computed)(() => props.disabled ?? providerContext.disabled.value);
		const delayDuration = (0, vue_exports.computed)(() => props.delayDuration ?? providerContext.delayDuration.value);
		const ignoreNonKeyboardFocus = (0, vue_exports.computed)(() => props.ignoreNonKeyboardFocus ?? providerContext.ignoreNonKeyboardFocus.value);
		const open = useVModel(props, "open", emit, {
			defaultValue: props.defaultOpen,
			passive: props.open === void 0
		});
		(0, vue_exports.watch)(open, (isOpen) => {
			if (!providerContext.onClose) return;
			if (isOpen) {
				providerContext.onOpen();
				(void 0).dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
			} else providerContext.onClose();
		});
		const wasOpenDelayedRef = (0, vue_exports.ref)(false);
		const trigger = (0, vue_exports.ref)();
		const stateAttribute = (0, vue_exports.computed)(() => {
			if (!open.value) return "closed";
			return wasOpenDelayedRef.value ? "delayed-open" : "instant-open";
		});
		const { start: startTimer, stop: clearTimer } = useTimeoutFn(() => {
			wasOpenDelayedRef.value = true;
			open.value = true;
		}, delayDuration, { immediate: false });
		function handleOpen() {
			clearTimer();
			wasOpenDelayedRef.value = false;
			open.value = true;
		}
		function handleClose() {
			clearTimer();
			open.value = false;
		}
		function handleDelayedOpen() {
			startTimer();
		}
		provideTooltipRootContext({
			contentId: "",
			open,
			stateAttribute,
			trigger,
			onTriggerChange(el) {
				trigger.value = el;
			},
			onTriggerEnter() {
				if (providerContext.isOpenDelayed.value) handleDelayedOpen();
				else handleOpen();
			},
			onTriggerLeave() {
				if (disableHoverableContent.value) handleClose();
				else clearTimer();
			},
			onOpen: handleOpen,
			onClose: handleClose,
			disableHoverableContent,
			disableClosingTrigger,
			disabled: disableTooltip,
			ignoreNonKeyboardFocus
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(PopperRoot_default), null, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", { open: (0, vue_exports.unref)(open) })]),
				_: 3
			});
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Tooltip/TooltipContentImpl.js
var TooltipContentImpl_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "TooltipContentImpl",
	props: {
		ariaLabel: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false,
			default: void 0
		},
		as: {
			type: null,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false,
			default: void 0
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false,
			default: void 0
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		}
	},
	emits: ["escapeKeyDown", "pointerDownOutside"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectTooltipRootContext();
		const providerContext = injectTooltipProviderContext();
		const { forwardRef, currentElement } = useForwardExpose();
		const ariaLabel = (0, vue_exports.computed)(() => props.ariaLabel || currentElement.value?.textContent);
		const popperContentProps = (0, vue_exports.computed)(() => {
			const { ariaLabel: _, ...restProps } = props;
			return defu(restProps, providerContext.content.value ?? {}, {
				side: "top",
				sideOffset: 0,
				align: "center",
				avoidCollisions: true,
				collisionBoundary: [],
				collisionPadding: 0,
				arrowPadding: 0,
				sticky: "partial",
				hideWhenDetached: false
			});
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DismissableLayer_default), {
				"as-child": "",
				"disable-outside-pointer-events": false,
				onEscapeKeyDown: _cache[0] || (_cache[0] = ($event) => emits("escapeKeyDown", $event)),
				onPointerDownOutside: _cache[1] || (_cache[1] = (event) => {
					if ((0, vue_exports.unref)(rootContext).disableClosingTrigger.value && (0, vue_exports.unref)(rootContext).trigger.value?.contains(event.target)) event.preventDefault();
					emits("pointerDownOutside", event);
				}),
				onFocusOutside: _cache[2] || (_cache[2] = (0, vue_exports.withModifiers)(() => {}, ["prevent"])),
				onDismiss: _cache[3] || (_cache[3] = ($event) => (0, vue_exports.unref)(rootContext).onClose())
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(PopperContent_default), (0, vue_exports.mergeProps)({
					ref: (0, vue_exports.unref)(forwardRef),
					"data-state": (0, vue_exports.unref)(rootContext).stateAttribute.value
				}, {
					..._ctx.$attrs,
					...popperContentProps.value
				}, { style: {
					"--reka-tooltip-content-transform-origin": "var(--reka-popper-transform-origin)",
					"--reka-tooltip-content-available-width": "var(--reka-popper-available-width)",
					"--reka-tooltip-content-available-height": "var(--reka-popper-available-height)",
					"--reka-tooltip-trigger-width": "var(--reka-popper-anchor-width)",
					"--reka-tooltip-trigger-height": "var(--reka-popper-anchor-height)"
				} }), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default"), (0, vue_exports.createVNode)((0, vue_exports.unref)(VisuallyHidden_default), {
						id: (0, vue_exports.unref)(rootContext).contentId,
						role: "tooltip"
					}, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(ariaLabel.value), 1)]),
						_: 1
					}, 8, ["id"])]),
					_: 3
				}, 16, ["data-state"])]),
				_: 3
			});
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Tooltip/TooltipContentHoverable.js
var TooltipContentHoverable_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "TooltipContentHoverable",
	props: {
		ariaLabel: {
			type: String,
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
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		const forwardedProps = useForwardProps$1(__props);
		const { forwardRef, currentElement } = useForwardExpose();
		const { trigger, onClose } = injectTooltipRootContext();
		const providerContext = injectTooltipProviderContext();
		const { isPointerInTransit, onPointerExit } = useGraceArea(trigger, currentElement);
		providerContext.isPointerInTransitRef = isPointerInTransit;
		onPointerExit(() => {
			onClose();
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(TooltipContentImpl_default, (0, vue_exports.mergeProps)({ ref: (0, vue_exports.unref)(forwardRef) }, (0, vue_exports.unref)(forwardedProps)), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Tooltip/TooltipContent.js
var TooltipContent_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "TooltipContent",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		ariaLabel: {
			type: String,
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
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		}
	},
	emits: ["escapeKeyDown", "pointerDownOutside"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectTooltipRootContext();
		const forwarded = useForwardPropsEmits(props, emits);
		const { forwardRef } = useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Presence_default), { present: _ctx.forceMount || (0, vue_exports.unref)(rootContext).open.value }, {
				default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.resolveDynamicComponent)((0, vue_exports.unref)(rootContext).disableHoverableContent.value ? TooltipContentImpl_default : TooltipContentHoverable_default), (0, vue_exports.mergeProps)({ ref: (0, vue_exports.unref)(forwardRef) }, (0, vue_exports.unref)(forwarded)), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 16))]),
				_: 3
			}, 8, ["present"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Tooltip/TooltipPortal.js
var TooltipPortal_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "TooltipPortal",
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
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Tooltip/TooltipTrigger.js
var TooltipTrigger_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "TooltipTrigger",
	props: {
		reference: {
			type: null,
			required: false
		},
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
		const rootContext = injectTooltipRootContext();
		const providerContext = injectTooltipProviderContext();
		rootContext.contentId ||= useId(void 0, "reka-tooltip-content");
		const { forwardRef} = useForwardExpose();
		const isPointerDown = (0, vue_exports.ref)(false);
		const hasPointerMoveOpened = (0, vue_exports.ref)(false);
		const tooltipListeners = (0, vue_exports.computed)(() => {
			if (rootContext.disabled.value) return {};
			return {
				click: handleClick,
				focus: handleFocus,
				pointermove: handlePointerMove,
				pointerleave: handlePointerLeave,
				pointerdown: handlePointerDown,
				blur: handleBlur
			};
		});
		function handlePointerUp() {
			setTimeout(() => {
				isPointerDown.value = false;
			}, 1);
		}
		function handlePointerDown() {
			if (rootContext.open && !rootContext.disableClosingTrigger.value) rootContext.onClose();
			isPointerDown.value = true;
			(void 0).addEventListener("pointerup", handlePointerUp, { once: true });
		}
		function handlePointerMove(event) {
			if (event.pointerType === "touch") return;
			if (!hasPointerMoveOpened.value && !providerContext.isPointerInTransitRef.value) {
				rootContext.onTriggerEnter();
				hasPointerMoveOpened.value = true;
			}
		}
		function handlePointerLeave() {
			rootContext.onTriggerLeave();
			hasPointerMoveOpened.value = false;
		}
		function handleFocus(event) {
			if (isPointerDown.value) return;
			if (rootContext.ignoreNonKeyboardFocus.value && !event.target.matches?.(":focus-visible")) return;
			rootContext.onOpen();
		}
		function handleBlur() {
			rootContext.onClose();
		}
		function handleClick() {
			if (!rootContext.disableClosingTrigger.value) rootContext.onClose();
		}
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(PopperAnchor_default), {
				"as-child": "",
				reference: _ctx.reference
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
					ref: (0, vue_exports.unref)(forwardRef),
					"aria-describedby": (0, vue_exports.unref)(rootContext).open.value ? (0, vue_exports.unref)(rootContext).contentId : void 0,
					"data-state": (0, vue_exports.unref)(rootContext).stateAttribute.value,
					as: _ctx.as,
					"as-child": props.asChild,
					"data-grace-area-trigger": ""
				}, (0, vue_exports.toHandlers)(tooltipListeners.value)), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 16, [
					"aria-describedby",
					"data-state",
					"as",
					"as-child"
				])]),
				_: 3
			}, 8, ["reference"]);
		};
	}
});
//#endregion
//#region app/composables/useDelayedPending.ts
function useDelayedPending(isPending, delay = 120) {
	const isVisible = (0, vue_exports.ref)(false);
	let timer;
	(0, vue_exports.watch)(isPending, (pending) => {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
		if (!pending) {
			isVisible.value = false;
			return;
		}
		timer = setTimeout(() => {
			isVisible.value = true;
			timer = void 0;
		}, delay);
	}, { immediate: true });
	(0, vue_exports.onScopeDispose)(() => {
		if (timer) clearTimeout(timer);
	});
	return isVisible;
}
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/composables/useKbd.js
var kbdKeysMap = {
	meta: "",
	ctrl: "",
	alt: "",
	win: "⊞",
	command: "⌘",
	shift: "⇧",
	control: "⌃",
	option: "⌥",
	enter: "↵",
	delete: "⌦",
	backspace: "⌫",
	escape: "Esc",
	tab: "⇥",
	capslock: "⇪",
	arrowup: "↑",
	arrowright: "→",
	arrowdown: "↓",
	arrowleft: "←",
	pageup: "⇞",
	pagedown: "⇟",
	home: "↖",
	end: "↘"
};
var _useKbd = () => {
	const macOS = (0, vue_exports.computed)(() => false);
	const kbdKeysSpecificMap = (0, vue_exports.reactive)({
		meta: " ",
		alt: " ",
		ctrl: " "
	});
	function getKbdKey(value) {
		if (!value) return;
		if ([
			"meta",
			"alt",
			"ctrl"
		].includes(value)) return kbdKeysSpecificMap[value];
		return kbdKeysMap[value] || value;
	}
	return {
		macOS,
		getKbdKey
	};
};
var useKbd = /* @__PURE__ */ createSharedComposable(_useKbd);
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fkbd.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fkbd_default = {
	"base": "inline-flex items-center justify-center px-1 rounded-sm font-medium font-sans uppercase",
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
			"solid": "",
			"outline": "",
			"soft": "",
			"subtle": ""
		},
		"size": {
			"sm": "h-4 min-w-[16px] text-[10px]",
			"md": "h-5 min-w-[20px] text-[11px]",
			"lg": "h-6 min-w-[24px] text-[12px]"
		}
	},
	"compoundVariants": [
		{
			"color": "primary",
			"variant": "solid",
			"class": "text-inverted bg-primary"
		},
		{
			"color": "secondary",
			"variant": "solid",
			"class": "text-inverted bg-secondary"
		},
		{
			"color": "success",
			"variant": "solid",
			"class": "text-inverted bg-success"
		},
		{
			"color": "info",
			"variant": "solid",
			"class": "text-inverted bg-info"
		},
		{
			"color": "warning",
			"variant": "solid",
			"class": "text-inverted bg-warning"
		},
		{
			"color": "error",
			"variant": "solid",
			"class": "text-inverted bg-error"
		},
		{
			"color": "primary",
			"variant": "outline",
			"class": "ring ring-inset ring-primary/50 text-primary"
		},
		{
			"color": "secondary",
			"variant": "outline",
			"class": "ring ring-inset ring-secondary/50 text-secondary"
		},
		{
			"color": "success",
			"variant": "outline",
			"class": "ring ring-inset ring-success/50 text-success"
		},
		{
			"color": "info",
			"variant": "outline",
			"class": "ring ring-inset ring-info/50 text-info"
		},
		{
			"color": "warning",
			"variant": "outline",
			"class": "ring ring-inset ring-warning/50 text-warning"
		},
		{
			"color": "error",
			"variant": "outline",
			"class": "ring ring-inset ring-error/50 text-error"
		},
		{
			"color": "primary",
			"variant": "soft",
			"class": "text-primary bg-primary/10"
		},
		{
			"color": "secondary",
			"variant": "soft",
			"class": "text-secondary bg-secondary/10"
		},
		{
			"color": "success",
			"variant": "soft",
			"class": "text-success bg-success/10"
		},
		{
			"color": "info",
			"variant": "soft",
			"class": "text-info bg-info/10"
		},
		{
			"color": "warning",
			"variant": "soft",
			"class": "text-warning bg-warning/10"
		},
		{
			"color": "error",
			"variant": "soft",
			"class": "text-error bg-error/10"
		},
		{
			"color": "primary",
			"variant": "subtle",
			"class": "text-primary ring ring-inset ring-primary/25 bg-primary/10"
		},
		{
			"color": "secondary",
			"variant": "subtle",
			"class": "text-secondary ring ring-inset ring-secondary/25 bg-secondary/10"
		},
		{
			"color": "success",
			"variant": "subtle",
			"class": "text-success ring ring-inset ring-success/25 bg-success/10"
		},
		{
			"color": "info",
			"variant": "subtle",
			"class": "text-info ring ring-inset ring-info/25 bg-info/10"
		},
		{
			"color": "warning",
			"variant": "subtle",
			"class": "text-warning ring ring-inset ring-warning/25 bg-warning/10"
		},
		{
			"color": "error",
			"variant": "subtle",
			"class": "text-error ring ring-inset ring-error/25 bg-error/10"
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
		}
	],
	"defaultVariants": {
		"variant": "outline",
		"color": "neutral",
		"size": "md"
	}
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/Kbd.vue
var _sfc_main$2 = {
	__name: "UKbd",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false,
			default: "kbd"
		},
		value: {
			type: null,
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
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		}
	},
	setup(__props) {
		const props = useComponentProps("kbd", __props);
		const { getKbdKey } = useKbd();
		const appConfig = useAppConfig();
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fkbd_default,
			...appConfig.ui?.kbd || {}
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
				as: (0, vue_exports.unref)(props).as,
				class: ui.value({
					class: [(0, vue_exports.unref)(props).ui?.base, (0, vue_exports.unref)(props).class],
					color: (0, vue_exports.unref)(props).color,
					variant: (0, vue_exports.unref)(props).variant,
					size: (0, vue_exports.unref)(props).size
				})
			}, _attrs), {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {}, () => {
						_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(getKbdKey)((0, vue_exports.unref)(props).value))}`);
					}, _push, _parent, _scopeId);
					else return [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(getKbdKey)((0, vue_exports.unref)(props).value)), 1)])];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/Kbd.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Ftooltip.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Ftooltip_default = { "slots": {
	"content": "flex items-center gap-1 bg-default text-highlighted shadow-sm rounded-sm ring ring-default h-6 px-2.5 py-1 text-xs select-none data-[state=delayed-open]:animate-[scale-in_100ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_100ms_var(--ease-out)] origin-(--reka-tooltip-content-transform-origin) pointer-events-auto",
	"arrow": "fill-bg stroke-default",
	"text": "truncate",
	"kbds": "hidden lg:inline-flex items-center shrink-0 gap-0.5 not-first-of-type:before:content-['·'] not-first-of-type:before:me-0.5",
	"kbdsSize": "sm"
} };
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/Tooltip.vue
var _sfc_main$1 = {
	__name: "UTooltip",
	__ssrInlineRender: true,
	props: {
		text: {
			type: String,
			required: false
		},
		kbds: {
			type: Array,
			required: false
		},
		content: {
			type: Object,
			required: false
		},
		arrow: {
			type: [Boolean, Object],
			required: false
		},
		portal: {
			type: [Boolean, String],
			required: false,
			skipCheck: true,
			default: true
		},
		reference: {
			type: null,
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
		defaultOpen: {
			type: Boolean,
			required: false
		},
		open: {
			type: Boolean,
			required: false
		},
		delayDuration: {
			type: Number,
			required: false
		},
		disableHoverableContent: {
			type: Boolean,
			required: false
		},
		disableClosingTrigger: {
			type: Boolean,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		ignoreNonKeyboardFocus: {
			type: Boolean,
			required: false
		}
	},
	emits: ["update:open"],
	setup(__props, { emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = (0, vue_exports.useSlots)();
		const props = useComponentProps("tooltip", _props);
		const appConfig = useAppConfig();
		const providerContext = injectTooltipProviderContext();
		const rootProps = useForwardProps(reactivePick(props, "defaultOpen", "open", "delayDuration", "disableHoverableContent", "disableClosingTrigger", "ignoreNonKeyboardFocus"), emits);
		const portalProps = usePortal((0, vue_exports.toRef)(() => props.portal));
		const contentProps = (0, vue_exports.toRef)(() => defu(props.content, providerContext.content.value, {
			side: "bottom",
			sideOffset: 8,
			collisionPadding: 8
		}));
		const arrowProps = (0, vue_exports.toRef)(() => defu(props.arrow, { rounded: true }));
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Ftooltip_default,
			...appConfig.ui?.tooltip || {}
		})({ side: contentProps.value.side }));
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(TooltipRoot_default), (0, vue_exports.mergeProps)((0, vue_exports.unref)(rootProps), { disabled: !((0, vue_exports.unref)(props).text || (0, vue_exports.unref)(props).kbds?.length || !!slots.content) || (0, vue_exports.unref)(props).disabled }, _attrs), {
				default: (0, vue_exports.withCtx)(({ open }, _push, _parent, _scopeId) => {
					if (_push) {
						if (!!slots.default || !!(0, vue_exports.unref)(props).reference) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(TooltipTrigger_default), (0, vue_exports.mergeProps)(_ctx.$attrs, {
							"as-child": "",
							reference: (0, vue_exports.unref)(props).reference,
							class: (0, vue_exports.unref)(props).class
						}), {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", { open }, null, _push, _parent, _scopeId);
								else return [(0, vue_exports.renderSlot)(_ctx.$slots, "default", { open })];
							}),
							_: 2
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(TooltipPortal_default), (0, vue_exports.unref)(portalProps), {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(FieldGroupReset), null, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(TooltipContent_default), (0, vue_exports.mergeProps)(contentProps.value, {
											"data-slot": "content",
											class: ui.value.content({ class: [!slots.default && (0, vue_exports.unref)(props).class, (0, vue_exports.unref)(props).ui?.content] })
										}), {
											default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
												if (_push) {
													(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "content", { ui: ui.value }, () => {
														if ((0, vue_exports.unref)(props).text) _push(`<span data-slot="text" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.text({ class: (0, vue_exports.unref)(props).ui?.text }))}"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).text)}</span>`);
														else _push(`<!---->`);
														if ((0, vue_exports.unref)(props).kbds?.length) {
															_push(`<span data-slot="kbds" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.kbds({ class: (0, vue_exports.unref)(props).ui?.kbds }))}"${_scopeId}><!--[-->`);
															(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(props).kbds, (kbd, index) => {
																_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$2, (0, vue_exports.mergeProps)({
																	key: index,
																	size: (0, vue_exports.unref)(props).ui?.kbdsSize || ui.value.kbdsSize()
																}, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, _parent, _scopeId));
															});
															_push(`<!--]--></span>`);
														} else _push(`<!---->`);
													}, _push, _parent, _scopeId);
													if (!!(0, vue_exports.unref)(props).arrow) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(TooltipArrow_default), (0, vue_exports.mergeProps)(arrowProps.value, {
														"data-slot": "arrow",
														class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
													}), null, _parent, _scopeId));
													else _push(`<!---->`);
												} else return [(0, vue_exports.renderSlot)(_ctx.$slots, "content", { ui: ui.value }, () => [(0, vue_exports.unref)(props).text ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
													key: 0,
													"data-slot": "text",
													class: ui.value.text({ class: (0, vue_exports.unref)(props).ui?.text })
												}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).text), 3)) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.unref)(props).kbds?.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
													key: 1,
													"data-slot": "kbds",
													class: ui.value.kbds({ class: (0, vue_exports.unref)(props).ui?.kbds })
												}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)((0, vue_exports.unref)(props).kbds, (kbd, index) => {
													return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
														key: index,
														size: (0, vue_exports.unref)(props).ui?.kbdsSize || ui.value.kbdsSize()
													}, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
												}), 128))], 2)) : (0, vue_exports.createCommentVNode)("", true)]), !!(0, vue_exports.unref)(props).arrow ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(TooltipArrow_default), (0, vue_exports.mergeProps)({ key: 0 }, arrowProps.value, {
													"data-slot": "arrow",
													class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
												}), null, 16, ["class"])) : (0, vue_exports.createCommentVNode)("", true)];
											}),
											_: 2
										}, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(TooltipContent_default), (0, vue_exports.mergeProps)(contentProps.value, {
											"data-slot": "content",
											class: ui.value.content({ class: [!slots.default && (0, vue_exports.unref)(props).class, (0, vue_exports.unref)(props).ui?.content] })
										}), {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "content", { ui: ui.value }, () => [(0, vue_exports.unref)(props).text ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
												key: 0,
												"data-slot": "text",
												class: ui.value.text({ class: (0, vue_exports.unref)(props).ui?.text })
											}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).text), 3)) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.unref)(props).kbds?.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
												key: 1,
												"data-slot": "kbds",
												class: ui.value.kbds({ class: (0, vue_exports.unref)(props).ui?.kbds })
											}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)((0, vue_exports.unref)(props).kbds, (kbd, index) => {
												return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
													key: index,
													size: (0, vue_exports.unref)(props).ui?.kbdsSize || ui.value.kbdsSize()
												}, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
											}), 128))], 2)) : (0, vue_exports.createCommentVNode)("", true)]), !!(0, vue_exports.unref)(props).arrow ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(TooltipArrow_default), (0, vue_exports.mergeProps)({ key: 0 }, arrowProps.value, {
												"data-slot": "arrow",
												class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
											}), null, 16, ["class"])) : (0, vue_exports.createCommentVNode)("", true)]),
											_: 3
										}, 16, ["class"])];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(FieldGroupReset), null, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(TooltipContent_default), (0, vue_exports.mergeProps)(contentProps.value, {
										"data-slot": "content",
										class: ui.value.content({ class: [!slots.default && (0, vue_exports.unref)(props).class, (0, vue_exports.unref)(props).ui?.content] })
									}), {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "content", { ui: ui.value }, () => [(0, vue_exports.unref)(props).text ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
											key: 0,
											"data-slot": "text",
											class: ui.value.text({ class: (0, vue_exports.unref)(props).ui?.text })
										}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).text), 3)) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.unref)(props).kbds?.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
											key: 1,
											"data-slot": "kbds",
											class: ui.value.kbds({ class: (0, vue_exports.unref)(props).ui?.kbds })
										}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)((0, vue_exports.unref)(props).kbds, (kbd, index) => {
											return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
												key: index,
												size: (0, vue_exports.unref)(props).ui?.kbdsSize || ui.value.kbdsSize()
											}, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
										}), 128))], 2)) : (0, vue_exports.createCommentVNode)("", true)]), !!(0, vue_exports.unref)(props).arrow ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(TooltipArrow_default), (0, vue_exports.mergeProps)({ key: 0 }, arrowProps.value, {
											"data-slot": "arrow",
											class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
										}), null, 16, ["class"])) : (0, vue_exports.createCommentVNode)("", true)]),
										_: 3
									}, 16, ["class"])]),
									_: 3
								})];
							}),
							_: 2
						}, _parent, _scopeId));
					} else return [!!slots.default || !!(0, vue_exports.unref)(props).reference ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(TooltipTrigger_default), (0, vue_exports.mergeProps)({ key: 0 }, _ctx.$attrs, {
						"as-child": "",
						reference: (0, vue_exports.unref)(props).reference,
						class: (0, vue_exports.unref)(props).class
					}), {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", { open })]),
						_: 2
					}, 1040, ["reference", "class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)((0, vue_exports.unref)(TooltipPortal_default), (0, vue_exports.unref)(portalProps), {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(FieldGroupReset), null, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(TooltipContent_default), (0, vue_exports.mergeProps)(contentProps.value, {
								"data-slot": "content",
								class: ui.value.content({ class: [!slots.default && (0, vue_exports.unref)(props).class, (0, vue_exports.unref)(props).ui?.content] })
							}), {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "content", { ui: ui.value }, () => [(0, vue_exports.unref)(props).text ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
									key: 0,
									"data-slot": "text",
									class: ui.value.text({ class: (0, vue_exports.unref)(props).ui?.text })
								}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).text), 3)) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.unref)(props).kbds?.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
									key: 1,
									"data-slot": "kbds",
									class: ui.value.kbds({ class: (0, vue_exports.unref)(props).ui?.kbds })
								}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)((0, vue_exports.unref)(props).kbds, (kbd, index) => {
									return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
										key: index,
										size: (0, vue_exports.unref)(props).ui?.kbdsSize || ui.value.kbdsSize()
									}, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
								}), 128))], 2)) : (0, vue_exports.createCommentVNode)("", true)]), !!(0, vue_exports.unref)(props).arrow ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(TooltipArrow_default), (0, vue_exports.mergeProps)({ key: 0 }, arrowProps.value, {
									"data-slot": "arrow",
									class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
								}), null, 16, ["class"])) : (0, vue_exports.createCommentVNode)("", true)]),
								_: 3
							}, 16, ["class"])]),
							_: 3
						})]),
						_: 3
					}, 16)];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/Tooltip.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fslideover.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fslideover_default = {
	"slots": {
		"overlay": "fixed inset-0 bg-elevated/75",
		"content": "fixed bg-default divide-y divide-default sm:ring ring-default sm:shadow-lg flex flex-col focus:outline-none",
		"header": "flex items-center gap-1.5 p-4 sm:px-6 min-h-(--ui-header-height)",
		"wrapper": "",
		"body": "flex-1 overflow-y-auto p-4 sm:p-6",
		"footer": "flex items-center gap-1.5 p-4 sm:px-6",
		"title": "text-highlighted font-semibold",
		"description": "mt-1 text-muted text-sm",
		"close": "absolute top-4 end-4"
	},
	"variants": {
		"side": {
			"top": { "content": "" },
			"right": { "content": "max-w-md" },
			"bottom": { "content": "" },
			"left": { "content": "max-w-md" }
		},
		"inset": { "true": { "content": "rounded-lg" } },
		"transition": { "true": { "overlay": "data-[state=open]:animate-[fade-in_200ms_var(--ease-out)] data-[state=closed]:animate-[fade-out_200ms_var(--ease-out)]" } }
	},
	"compoundVariants": [
		{
			"side": "top",
			"inset": true,
			"class": { "content": "max-h-[calc(100%-2rem)] inset-x-4 top-4" }
		},
		{
			"side": "top",
			"inset": false,
			"class": { "content": "max-h-full inset-x-0 top-0" }
		},
		{
			"side": "right",
			"inset": true,
			"class": { "content": "w-[calc(100%-2rem)] inset-y-4 right-4" }
		},
		{
			"side": "right",
			"inset": false,
			"class": { "content": "w-full inset-y-0 right-0" }
		},
		{
			"side": "bottom",
			"inset": true,
			"class": { "content": "max-h-[calc(100%-2rem)] inset-x-4 bottom-4" }
		},
		{
			"side": "bottom",
			"inset": false,
			"class": { "content": "max-h-full inset-x-0 bottom-0" }
		},
		{
			"side": "left",
			"inset": true,
			"class": { "content": "w-[calc(100%-2rem)] inset-y-4 left-4" }
		},
		{
			"side": "left",
			"inset": false,
			"class": { "content": "w-full inset-y-0 left-0" }
		},
		{
			"transition": true,
			"side": "top",
			"class": { "content": "data-[state=open]:animate-[slide-in-from-top_200ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-top_200ms_var(--ease-out)]" }
		},
		{
			"transition": true,
			"side": "right",
			"class": { "content": "data-[state=open]:animate-[slide-in-from-right_200ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-right_200ms_var(--ease-out)]" }
		},
		{
			"transition": true,
			"side": "bottom",
			"class": { "content": "data-[state=open]:animate-[slide-in-from-bottom_200ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-bottom_200ms_var(--ease-out)]" }
		},
		{
			"transition": true,
			"side": "left",
			"class": { "content": "data-[state=open]:animate-[slide-in-from-left_200ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-left_200ms_var(--ease-out)]" }
		}
	]
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/Slideover.vue
var _sfc_main = {
	__name: "USlideover",
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
		transition: {
			type: Boolean,
			required: false,
			default: true
		},
		side: {
			type: null,
			required: false,
			default: "right"
		},
		inset: {
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
		const props = useComponentProps("slideover", _props);
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
			return { pointerDownOutside };
		});
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fslideover_default,
			...appConfig.ui?.slideover || {}
		})({
			transition: props.transition,
			side: props.side,
			inset: props.inset
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogRoot_default), (0, vue_exports.mergeProps)((0, vue_exports.unref)(rootProps), _attrs), {
				default: (0, vue_exports.withCtx)(({ open, close }, _push, _parent, _scopeId) => {
					if (_push) {
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
											if ((0, vue_exports.unref)(props).overlay) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogOverlay_default), {
												"data-slot": "overlay",
												class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
											}, null, _parent, _scopeId));
											else _push(`<!---->`);
											_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogContent_default), (0, vue_exports.mergeProps)({
												"data-side": (0, vue_exports.unref)(props).side,
												"data-slot": "content",
												class: ui.value.content({ class: [!slots.default && (0, vue_exports.unref)(props).class, (0, vue_exports.unref)(props).ui?.content] })
											}, contentProps.value, {
												onEnter: ($event) => emits("enter"),
												onAfterEnter: ($event) => emits("after:enter"),
												onLeave: ($event) => emits("leave"),
												onAfterLeave: ($event) => emits("after:leave")
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
																				if ((0, vue_exports.unref)(props).close) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$3, (0, vue_exports.mergeProps)({
																					icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
																					color: "neutral",
																					variant: "ghost",
																					"aria-label": (0, vue_exports.unref)(t)("slideover.close")
																				}, typeof (0, vue_exports.unref)(props).close === "object" ? (0, vue_exports.unref)(props).close : {}, {
																					"data-slot": "close",
																					class: ui.value.close({ class: (0, vue_exports.unref)(props).ui?.close })
																				}), null, _parent, _scopeId));
																				else _push(`<!---->`);
																			}, _push, _parent, _scopeId);
																			else return [(0, vue_exports.renderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => [(0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
																				key: 0,
																				icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
																				color: "neutral",
																				variant: "ghost",
																				"aria-label": (0, vue_exports.unref)(t)("slideover.close")
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
															_push(`<div data-slot="body" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.body({ class: (0, vue_exports.unref)(props).ui?.body }))}"${_scopeId}>`);
															(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "body", { close }, null, _push, _parent, _scopeId);
															_push(`</div>`);
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
																default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => [(0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
																	key: 0,
																	icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
																	color: "neutral",
																	variant: "ghost",
																	"aria-label": (0, vue_exports.unref)(t)("slideover.close")
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
														(0, vue_exports.createVNode)("div", {
															"data-slot": "body",
															class: ui.value.body({ class: (0, vue_exports.unref)(props).ui?.body })
														}, [(0, vue_exports.renderSlot)(_ctx.$slots, "body", { close })], 2),
														!!slots.footer ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
															key: 1,
															"data-slot": "footer",
															class: ui.value.footer({ class: (0, vue_exports.unref)(props).ui?.footer })
														}, [(0, vue_exports.renderSlot)(_ctx.$slots, "footer", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true)
													])];
												}),
												_: 2
											}, _parent, _scopeId));
										} else return [(0, vue_exports.unref)(props).overlay ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
											key: 0,
											"data-slot": "overlay",
											class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
										}, null, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)((0, vue_exports.unref)(DialogContent_default), (0, vue_exports.mergeProps)({
											"data-side": (0, vue_exports.unref)(props).side,
											"data-slot": "content",
											class: ui.value.content({ class: [!slots.default && (0, vue_exports.unref)(props).class, (0, vue_exports.unref)(props).ui?.content] })
										}, contentProps.value, {
											onEnter: ($event) => emits("enter"),
											onAfterEnter: ($event) => emits("after:enter"),
											onLeave: ($event) => emits("leave"),
											onAfterLeave: ($event) => emits("after:leave")
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
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => [(0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
															key: 0,
															icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
															color: "neutral",
															variant: "ghost",
															"aria-label": (0, vue_exports.unref)(t)("slideover.close")
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
												(0, vue_exports.createVNode)("div", {
													"data-slot": "body",
													class: ui.value.body({ class: (0, vue_exports.unref)(props).ui?.body })
												}, [(0, vue_exports.renderSlot)(_ctx.$slots, "body", { close })], 2),
												!!slots.footer ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
													key: 1,
													"data-slot": "footer",
													class: ui.value.footer({ class: (0, vue_exports.unref)(props).ui?.footer })
												}, [(0, vue_exports.renderSlot)(_ctx.$slots, "footer", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true)
											])]),
											_: 2
										}, 1040, [
											"data-side",
											"class",
											"onEnter",
											"onAfterEnter",
											"onLeave",
											"onAfterLeave"
										])];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(FieldGroupReset), null, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.unref)(props).overlay ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
										key: 0,
										"data-slot": "overlay",
										class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
									}, null, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)((0, vue_exports.unref)(DialogContent_default), (0, vue_exports.mergeProps)({
										"data-side": (0, vue_exports.unref)(props).side,
										"data-slot": "content",
										class: ui.value.content({ class: [!slots.default && (0, vue_exports.unref)(props).class, (0, vue_exports.unref)(props).ui?.content] })
									}, contentProps.value, {
										onEnter: ($event) => emits("enter"),
										onAfterEnter: ($event) => emits("after:enter"),
										onLeave: ($event) => emits("leave"),
										onAfterLeave: ($event) => emits("after:leave")
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
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => [(0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
														key: 0,
														icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
														color: "neutral",
														variant: "ghost",
														"aria-label": (0, vue_exports.unref)(t)("slideover.close")
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
											(0, vue_exports.createVNode)("div", {
												"data-slot": "body",
												class: ui.value.body({ class: (0, vue_exports.unref)(props).ui?.body })
											}, [(0, vue_exports.renderSlot)(_ctx.$slots, "body", { close })], 2),
											!!slots.footer ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
												key: 1,
												"data-slot": "footer",
												class: ui.value.footer({ class: (0, vue_exports.unref)(props).ui?.footer })
											}, [(0, vue_exports.renderSlot)(_ctx.$slots, "footer", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true)
										])]),
										_: 2
									}, 1040, [
										"data-side",
										"class",
										"onEnter",
										"onAfterEnter",
										"onLeave",
										"onAfterLeave"
									])]),
									_: 2
								}, 1024)];
							}),
							_: 2
						}, _parent, _scopeId));
					} else return [!!slots.default ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTrigger_default), {
						key: 0,
						"as-child": "",
						class: (0, vue_exports.unref)(props).class
					}, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", { open })]),
						_: 2
					}, 1032, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)((0, vue_exports.unref)(DialogPortal_default), (0, vue_exports.mergeProps)((0, vue_exports.unref)(portalProps), { "force-mount": (0, vue_exports.unref)(portalProps).disabled && (0, vue_exports.unref)(props).unmountOnHide === false || void 0 }), {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(FieldGroupReset), null, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.unref)(props).overlay ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
								key: 0,
								"data-slot": "overlay",
								class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
							}, null, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)((0, vue_exports.unref)(DialogContent_default), (0, vue_exports.mergeProps)({
								"data-side": (0, vue_exports.unref)(props).side,
								"data-slot": "content",
								class: ui.value.content({ class: [!slots.default && (0, vue_exports.unref)(props).class, (0, vue_exports.unref)(props).ui?.content] })
							}, contentProps.value, {
								onEnter: ($event) => emits("enter"),
								onAfterEnter: ($event) => emits("after:enter"),
								onLeave: ($event) => emits("leave"),
								onAfterLeave: ($event) => emits("after:leave")
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
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => [(0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
												key: 0,
												icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
												color: "neutral",
												variant: "ghost",
												"aria-label": (0, vue_exports.unref)(t)("slideover.close")
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
									(0, vue_exports.createVNode)("div", {
										"data-slot": "body",
										class: ui.value.body({ class: (0, vue_exports.unref)(props).ui?.body })
									}, [(0, vue_exports.renderSlot)(_ctx.$slots, "body", { close })], 2),
									!!slots.footer ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 1,
										"data-slot": "footer",
										class: ui.value.footer({ class: (0, vue_exports.unref)(props).ui?.footer })
									}, [(0, vue_exports.renderSlot)(_ctx.$slots, "footer", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true)
								])]),
								_: 2
							}, 1040, [
								"data-side",
								"class",
								"onEnter",
								"onAfterEnter",
								"onLeave",
								"onAfterLeave"
							])]),
							_: 2
						}, 1024)]),
						_: 2
					}, 1040, ["force-mount"])];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/Slideover.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _, _sfc_main$1 as a, useDelayedPending as u };
//# sourceMappingURL=Slideover-TqYMRGsh.mjs.map
