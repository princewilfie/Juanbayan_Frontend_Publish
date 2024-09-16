import {
  __glob
} from "./chunk-BYTETG5J.js";

// node_modules/@ionic/core/components/index5.js
var win = typeof window !== "undefined" ? window : void 0;
var doc = typeof document !== "undefined" ? document : void 0;

// node_modules/@ionic/core/components/animation.js
var animationPrefix;
var getAnimationPrefix = (el) => {
  if (animationPrefix === void 0) {
    const supportsUnprefixed = el.style.animationName !== void 0;
    const supportsWebkitPrefix = el.style.webkitAnimationName !== void 0;
    animationPrefix = !supportsUnprefixed && supportsWebkitPrefix ? "-webkit-" : "";
  }
  return animationPrefix;
};
var setStyleProperty = (element, propertyName, value) => {
  const prefix = propertyName.startsWith("animation") ? getAnimationPrefix(element) : "";
  element.style.setProperty(prefix + propertyName, value);
};
var addClassToArray = (classes = [], className) => {
  if (className !== void 0) {
    const classNameToAppend = Array.isArray(className) ? className : [className];
    return [...classes, ...classNameToAppend];
  }
  return classes;
};
var createAnimation = (animationId) => {
  let _delay;
  let _duration;
  let _easing;
  let _iterations;
  let _fill;
  let _direction;
  let _keyframes = [];
  let beforeAddClasses = [];
  let beforeRemoveClasses = [];
  let initialized = false;
  let parentAnimation;
  let beforeStylesValue = {};
  let afterAddClasses = [];
  let afterRemoveClasses = [];
  let afterStylesValue = {};
  let numAnimationsRunning = 0;
  let shouldForceLinearEasing = false;
  let shouldForceSyncPlayback = false;
  let forceDirectionValue;
  let forceDurationValue;
  let forceDelayValue;
  let willComplete = true;
  let finished = false;
  let shouldCalculateNumAnimations = true;
  let ani;
  let paused = false;
  const id = animationId;
  const onFinishCallbacks = [];
  const onFinishOneTimeCallbacks = [];
  const onStopOneTimeCallbacks = [];
  const elements = [];
  const childAnimations = [];
  const stylesheets = [];
  const _beforeAddReadFunctions = [];
  const _beforeAddWriteFunctions = [];
  const _afterAddReadFunctions = [];
  const _afterAddWriteFunctions = [];
  const webAnimations = [];
  const supportsAnimationEffect = typeof AnimationEffect === "function" || win !== void 0 && typeof win.AnimationEffect === "function";
  const supportsWebAnimations = typeof Element === "function" && typeof Element.prototype.animate === "function" && supportsAnimationEffect;
  const getWebAnimations = () => {
    return webAnimations;
  };
  const destroy = (clearStyleSheets) => {
    childAnimations.forEach((childAnimation) => {
      childAnimation.destroy(clearStyleSheets);
    });
    cleanUp(clearStyleSheets);
    elements.length = 0;
    childAnimations.length = 0;
    _keyframes.length = 0;
    clearOnFinish();
    initialized = false;
    shouldCalculateNumAnimations = true;
    return ani;
  };
  const cleanUp = (clearStyleSheets) => {
    cleanUpElements();
    if (clearStyleSheets) {
      cleanUpStyleSheets();
    }
  };
  const resetFlags = () => {
    shouldForceLinearEasing = false;
    shouldForceSyncPlayback = false;
    shouldCalculateNumAnimations = true;
    forceDirectionValue = void 0;
    forceDurationValue = void 0;
    forceDelayValue = void 0;
    numAnimationsRunning = 0;
    finished = false;
    willComplete = true;
    paused = false;
  };
  const isRunning = () => {
    return numAnimationsRunning !== 0 && !paused;
  };
  const clearCallback = (callbackToRemove, callbackObjects) => {
    const index = callbackObjects.findIndex((callbackObject) => callbackObject.c === callbackToRemove);
    if (index > -1) {
      callbackObjects.splice(index, 1);
    }
  };
  const onStop = (callback, opts) => {
    onStopOneTimeCallbacks.push({ c: callback, o: opts });
    return ani;
  };
  const onFinish = (callback, opts) => {
    const callbacks = (opts === null || opts === void 0 ? void 0 : opts.oneTimeCallback) ? onFinishOneTimeCallbacks : onFinishCallbacks;
    callbacks.push({ c: callback, o: opts });
    return ani;
  };
  const clearOnFinish = () => {
    onFinishCallbacks.length = 0;
    onFinishOneTimeCallbacks.length = 0;
    return ani;
  };
  const cleanUpElements = () => {
    if (supportsWebAnimations) {
      webAnimations.forEach((animation) => {
        animation.cancel();
      });
      webAnimations.length = 0;
    }
  };
  const cleanUpStyleSheets = () => {
    stylesheets.forEach((stylesheet) => {
      if (stylesheet === null || stylesheet === void 0 ? void 0 : stylesheet.parentNode) {
        stylesheet.parentNode.removeChild(stylesheet);
      }
    });
    stylesheets.length = 0;
  };
  const beforeAddRead = (readFn) => {
    _beforeAddReadFunctions.push(readFn);
    return ani;
  };
  const beforeAddWrite = (writeFn) => {
    _beforeAddWriteFunctions.push(writeFn);
    return ani;
  };
  const afterAddRead = (readFn) => {
    _afterAddReadFunctions.push(readFn);
    return ani;
  };
  const afterAddWrite = (writeFn) => {
    _afterAddWriteFunctions.push(writeFn);
    return ani;
  };
  const beforeAddClass = (className) => {
    beforeAddClasses = addClassToArray(beforeAddClasses, className);
    return ani;
  };
  const beforeRemoveClass = (className) => {
    beforeRemoveClasses = addClassToArray(beforeRemoveClasses, className);
    return ani;
  };
  const beforeStyles = (styles = {}) => {
    beforeStylesValue = styles;
    return ani;
  };
  const beforeClearStyles = (propertyNames = []) => {
    for (const property of propertyNames) {
      beforeStylesValue[property] = "";
    }
    return ani;
  };
  const afterAddClass = (className) => {
    afterAddClasses = addClassToArray(afterAddClasses, className);
    return ani;
  };
  const afterRemoveClass = (className) => {
    afterRemoveClasses = addClassToArray(afterRemoveClasses, className);
    return ani;
  };
  const afterStyles = (styles = {}) => {
    afterStylesValue = styles;
    return ani;
  };
  const afterClearStyles = (propertyNames = []) => {
    for (const property of propertyNames) {
      afterStylesValue[property] = "";
    }
    return ani;
  };
  const getFill = () => {
    if (_fill !== void 0) {
      return _fill;
    }
    if (parentAnimation) {
      return parentAnimation.getFill();
    }
    return "both";
  };
  const getDirection = () => {
    if (forceDirectionValue !== void 0) {
      return forceDirectionValue;
    }
    if (_direction !== void 0) {
      return _direction;
    }
    if (parentAnimation) {
      return parentAnimation.getDirection();
    }
    return "normal";
  };
  const getEasing = () => {
    if (shouldForceLinearEasing) {
      return "linear";
    }
    if (_easing !== void 0) {
      return _easing;
    }
    if (parentAnimation) {
      return parentAnimation.getEasing();
    }
    return "linear";
  };
  const getDuration = () => {
    if (shouldForceSyncPlayback) {
      return 0;
    }
    if (forceDurationValue !== void 0) {
      return forceDurationValue;
    }
    if (_duration !== void 0) {
      return _duration;
    }
    if (parentAnimation) {
      return parentAnimation.getDuration();
    }
    return 0;
  };
  const getIterations = () => {
    if (_iterations !== void 0) {
      return _iterations;
    }
    if (parentAnimation) {
      return parentAnimation.getIterations();
    }
    return 1;
  };
  const getDelay = () => {
    if (forceDelayValue !== void 0) {
      return forceDelayValue;
    }
    if (_delay !== void 0) {
      return _delay;
    }
    if (parentAnimation) {
      return parentAnimation.getDelay();
    }
    return 0;
  };
  const getKeyframes = () => {
    return _keyframes;
  };
  const direction = (animationDirection) => {
    _direction = animationDirection;
    update(true);
    return ani;
  };
  const fill = (animationFill) => {
    _fill = animationFill;
    update(true);
    return ani;
  };
  const delay = (animationDelay) => {
    _delay = animationDelay;
    update(true);
    return ani;
  };
  const easing = (animationEasing) => {
    _easing = animationEasing;
    update(true);
    return ani;
  };
  const duration = (animationDuration) => {
    if (!supportsWebAnimations && animationDuration === 0) {
      animationDuration = 1;
    }
    _duration = animationDuration;
    update(true);
    return ani;
  };
  const iterations = (animationIterations) => {
    _iterations = animationIterations;
    update(true);
    return ani;
  };
  const parent = (animation) => {
    parentAnimation = animation;
    return ani;
  };
  const addElement = (el) => {
    if (el != null) {
      if (el.nodeType === 1) {
        elements.push(el);
      } else if (el.length >= 0) {
        for (let i = 0; i < el.length; i++) {
          elements.push(el[i]);
        }
      } else {
        console.error("Invalid addElement value");
      }
    }
    return ani;
  };
  const addAnimation = (animationToAdd) => {
    if (animationToAdd != null) {
      if (Array.isArray(animationToAdd)) {
        for (const animation of animationToAdd) {
          animation.parent(ani);
          childAnimations.push(animation);
        }
      } else {
        animationToAdd.parent(ani);
        childAnimations.push(animationToAdd);
      }
    }
    return ani;
  };
  const keyframes = (keyframeValues) => {
    const different = _keyframes !== keyframeValues;
    _keyframes = keyframeValues;
    if (different) {
      updateKeyframes(_keyframes);
    }
    return ani;
  };
  const updateKeyframes = (keyframeValues) => {
    if (supportsWebAnimations) {
      getWebAnimations().forEach((animation) => {
        const keyframeEffect = animation.effect;
        if (keyframeEffect.setKeyframes) {
          keyframeEffect.setKeyframes(keyframeValues);
        } else {
          const newEffect = new KeyframeEffect(keyframeEffect.target, keyframeValues, keyframeEffect.getTiming());
          animation.effect = newEffect;
        }
      });
    }
  };
  const beforeAnimation = () => {
    _beforeAddReadFunctions.forEach((callback) => callback());
    _beforeAddWriteFunctions.forEach((callback) => callback());
    const addClasses = beforeAddClasses;
    const removeClasses = beforeRemoveClasses;
    const styles = beforeStylesValue;
    elements.forEach((el) => {
      const elementClassList = el.classList;
      addClasses.forEach((c) => elementClassList.add(c));
      removeClasses.forEach((c) => elementClassList.remove(c));
      for (const property in styles) {
        if (styles.hasOwnProperty(property)) {
          setStyleProperty(el, property, styles[property]);
        }
      }
    });
  };
  const afterAnimation = () => {
    _afterAddReadFunctions.forEach((callback) => callback());
    _afterAddWriteFunctions.forEach((callback) => callback());
    const currentStep = willComplete ? 1 : 0;
    const addClasses = afterAddClasses;
    const removeClasses = afterRemoveClasses;
    const styles = afterStylesValue;
    elements.forEach((el) => {
      const elementClassList = el.classList;
      addClasses.forEach((c) => elementClassList.add(c));
      removeClasses.forEach((c) => elementClassList.remove(c));
      for (const property in styles) {
        if (styles.hasOwnProperty(property)) {
          setStyleProperty(el, property, styles[property]);
        }
      }
    });
    forceDurationValue = void 0;
    forceDirectionValue = void 0;
    forceDelayValue = void 0;
    onFinishCallbacks.forEach((onFinishCallback) => {
      return onFinishCallback.c(currentStep, ani);
    });
    onFinishOneTimeCallbacks.forEach((onFinishCallback) => {
      return onFinishCallback.c(currentStep, ani);
    });
    onFinishOneTimeCallbacks.length = 0;
    shouldCalculateNumAnimations = true;
    if (willComplete) {
      finished = true;
    }
    willComplete = true;
  };
  const animationFinish = () => {
    if (numAnimationsRunning === 0) {
      return;
    }
    numAnimationsRunning--;
    if (numAnimationsRunning === 0) {
      afterAnimation();
      if (parentAnimation) {
        parentAnimation.animationFinish();
      }
    }
  };
  const initializeWebAnimation = () => {
    elements.forEach((element) => {
      const animation = element.animate(_keyframes, {
        id,
        delay: getDelay(),
        duration: getDuration(),
        easing: getEasing(),
        iterations: getIterations(),
        fill: getFill(),
        direction: getDirection()
      });
      animation.pause();
      webAnimations.push(animation);
    });
    if (webAnimations.length > 0) {
      webAnimations[0].onfinish = () => {
        animationFinish();
      };
    }
  };
  const initializeAnimation = () => {
    beforeAnimation();
    if (_keyframes.length > 0) {
      if (supportsWebAnimations) {
        initializeWebAnimation();
      }
    }
    initialized = true;
  };
  const setAnimationStep = (step) => {
    step = Math.min(Math.max(step, 0), 0.9999);
    if (supportsWebAnimations) {
      webAnimations.forEach((animation) => {
        animation.currentTime = animation.effect.getComputedTiming().delay + getDuration() * step;
        animation.pause();
      });
    }
  };
  const updateWebAnimation = (step) => {
    webAnimations.forEach((animation) => {
      animation.effect.updateTiming({
        delay: getDelay(),
        duration: getDuration(),
        easing: getEasing(),
        iterations: getIterations(),
        fill: getFill(),
        direction: getDirection()
      });
    });
    if (step !== void 0) {
      setAnimationStep(step);
    }
  };
  const update = (deep = false, toggleAnimationName = true, step) => {
    if (deep) {
      childAnimations.forEach((animation) => {
        animation.update(deep, toggleAnimationName, step);
      });
    }
    if (supportsWebAnimations) {
      updateWebAnimation(step);
    }
    return ani;
  };
  const progressStart = (forceLinearEasing = false, step) => {
    childAnimations.forEach((animation) => {
      animation.progressStart(forceLinearEasing, step);
    });
    pauseAnimation();
    shouldForceLinearEasing = forceLinearEasing;
    if (!initialized) {
      initializeAnimation();
    }
    update(false, true, step);
    return ani;
  };
  const progressStep = (step) => {
    childAnimations.forEach((animation) => {
      animation.progressStep(step);
    });
    setAnimationStep(step);
    return ani;
  };
  const progressEnd = (playTo, step, dur) => {
    shouldForceLinearEasing = false;
    childAnimations.forEach((animation) => {
      animation.progressEnd(playTo, step, dur);
    });
    if (dur !== void 0) {
      forceDurationValue = dur;
    }
    finished = false;
    willComplete = true;
    if (playTo === 0) {
      forceDirectionValue = getDirection() === "reverse" ? "normal" : "reverse";
      if (forceDirectionValue === "reverse") {
        willComplete = false;
      }
      if (supportsWebAnimations) {
        update();
        setAnimationStep(1 - step);
      } else {
        forceDelayValue = (1 - step) * getDuration() * -1;
        update(false, false);
      }
    } else if (playTo === 1) {
      if (supportsWebAnimations) {
        update();
        setAnimationStep(step);
      } else {
        forceDelayValue = step * getDuration() * -1;
        update(false, false);
      }
    }
    if (playTo !== void 0 && !parentAnimation) {
      play();
    }
    return ani;
  };
  const pauseAnimation = () => {
    if (initialized) {
      if (supportsWebAnimations) {
        webAnimations.forEach((animation) => {
          animation.pause();
        });
      } else {
        elements.forEach((element) => {
          setStyleProperty(element, "animation-play-state", "paused");
        });
      }
      paused = true;
    }
  };
  const pause = () => {
    childAnimations.forEach((animation) => {
      animation.pause();
    });
    pauseAnimation();
    return ani;
  };
  const playCSSAnimations = () => {
    animationFinish();
  };
  const playWebAnimations = () => {
    webAnimations.forEach((animation) => {
      animation.play();
    });
    if (_keyframes.length === 0 || elements.length === 0) {
      animationFinish();
    }
  };
  const resetAnimation = () => {
    if (supportsWebAnimations) {
      setAnimationStep(0);
      updateWebAnimation();
    }
  };
  const play = (opts) => {
    return new Promise((resolve) => {
      if (opts === null || opts === void 0 ? void 0 : opts.sync) {
        shouldForceSyncPlayback = true;
        onFinish(() => shouldForceSyncPlayback = false, { oneTimeCallback: true });
      }
      if (!initialized) {
        initializeAnimation();
      }
      if (finished) {
        resetAnimation();
        finished = false;
      }
      if (shouldCalculateNumAnimations) {
        numAnimationsRunning = childAnimations.length + 1;
        shouldCalculateNumAnimations = false;
      }
      const onStopCallback = () => {
        clearCallback(onFinishCallback, onFinishOneTimeCallbacks);
        resolve();
      };
      const onFinishCallback = () => {
        clearCallback(onStopCallback, onStopOneTimeCallbacks);
        resolve();
      };
      onFinish(onFinishCallback, { oneTimeCallback: true });
      onStop(onStopCallback, { oneTimeCallback: true });
      childAnimations.forEach((animation) => {
        animation.play();
      });
      if (supportsWebAnimations) {
        playWebAnimations();
      } else {
        playCSSAnimations();
      }
      paused = false;
    });
  };
  const stop = () => {
    childAnimations.forEach((animation) => {
      animation.stop();
    });
    if (initialized) {
      cleanUpElements();
      initialized = false;
    }
    resetFlags();
    onStopOneTimeCallbacks.forEach((onStopCallback) => onStopCallback.c(0, ani));
    onStopOneTimeCallbacks.length = 0;
  };
  const from = (property, value) => {
    const firstFrame = _keyframes[0];
    if (firstFrame !== void 0 && (firstFrame.offset === void 0 || firstFrame.offset === 0)) {
      firstFrame[property] = value;
    } else {
      _keyframes = [{ offset: 0, [property]: value }, ..._keyframes];
    }
    return ani;
  };
  const to = (property, value) => {
    const lastFrame = _keyframes[_keyframes.length - 1];
    if (lastFrame !== void 0 && (lastFrame.offset === void 0 || lastFrame.offset === 1)) {
      lastFrame[property] = value;
    } else {
      _keyframes = [..._keyframes, { offset: 1, [property]: value }];
    }
    return ani;
  };
  const fromTo = (property, fromValue, toValue) => {
    return from(property, fromValue).to(property, toValue);
  };
  return ani = {
    parentAnimation,
    elements,
    childAnimations,
    id,
    animationFinish,
    from,
    to,
    fromTo,
    parent,
    play,
    pause,
    stop,
    destroy,
    keyframes,
    addAnimation,
    addElement,
    update,
    fill,
    direction,
    iterations,
    duration,
    easing,
    delay,
    getWebAnimations,
    getKeyframes,
    getFill,
    getDirection,
    getDelay,
    getIterations,
    getEasing,
    getDuration,
    afterAddRead,
    afterAddWrite,
    afterClearStyles,
    afterStyles,
    afterRemoveClass,
    afterAddClass,
    beforeAddRead,
    beforeAddWrite,
    beforeClearStyles,
    beforeStyles,
    beforeRemoveClass,
    beforeAddClass,
    onFinish,
    isRunning,
    progressStart,
    progressStep,
    progressEnd
  };
};

// node_modules/@stencil/core/internal/app-data/index.js
var BUILD = {
  allRenderFn: false,
  cmpDidLoad: true,
  cmpDidUnload: false,
  cmpDidUpdate: true,
  cmpDidRender: true,
  cmpWillLoad: true,
  cmpWillUpdate: true,
  cmpWillRender: true,
  connectedCallback: true,
  disconnectedCallback: true,
  element: true,
  event: true,
  hasRenderFn: true,
  lifecycle: true,
  hostListener: true,
  hostListenerTargetWindow: true,
  hostListenerTargetDocument: true,
  hostListenerTargetBody: true,
  hostListenerTargetParent: false,
  hostListenerTarget: true,
  member: true,
  method: true,
  mode: true,
  observeAttribute: true,
  prop: true,
  propMutable: true,
  reflect: true,
  scoped: true,
  shadowDom: true,
  slot: true,
  cssAnnotations: true,
  state: true,
  style: true,
  formAssociated: false,
  svg: true,
  updatable: true,
  vdomAttribute: true,
  vdomXlink: true,
  vdomClass: true,
  vdomFunctional: true,
  vdomKey: true,
  vdomListener: true,
  vdomRef: true,
  vdomPropOrAttr: true,
  vdomRender: true,
  vdomStyle: true,
  vdomText: true,
  watchCallback: true,
  taskQueue: true,
  hotModuleReplacement: false,
  isDebug: false,
  isDev: false,
  isTesting: false,
  hydrateServerSide: false,
  hydrateClientSide: false,
  lifecycleDOMEvents: false,
  lazyLoad: false,
  profile: false,
  slotRelocation: true,
  // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
  appendChildSlotFix: false,
  // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
  cloneNodeFix: false,
  hydratedAttribute: false,
  hydratedClass: true,
  // TODO(STENCIL-1305): remove this option
  scriptDataOpts: false,
  // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
  scopedSlotTextContentFix: false,
  // TODO(STENCIL-854): Remove code related to legacy shadowDomShim field
  shadowDomShim: false,
  // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
  slotChildNodesFix: false,
  invisiblePrehydration: true,
  propBoolean: true,
  propNumber: true,
  propString: true,
  constructableCSS: true,
  cmpShouldUpdate: true,
  devTools: false,
  shadowDelegatesFocus: true,
  initializeNextTick: false,
  asyncLoading: true,
  asyncQueue: false,
  transformTagName: false,
  attachStyles: true,
  // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
  experimentalSlotFixes: false
};

// import("./**/*.entry.js*") in node_modules/@stencil/core/internal/client/index.js
var globImport_entry_js = __glob({});

// node_modules/@stencil/core/internal/client/index.js
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var Build = {
  isDev: BUILD.isDev ? true : false,
  isBrowser: true,
  isServer: false,
  isTesting: BUILD.isTesting ? true : false
};
var hostRefs = BUILD.hotModuleReplacement ? window.__STENCIL_HOSTREFS__ || (window.__STENCIL_HOSTREFS__ = /* @__PURE__ */ new WeakMap()) : /* @__PURE__ */ new WeakMap();
var getHostRef = (ref) => hostRefs.get(ref);
var customError;
var consoleError = (e, el) => (customError || console.error)(e, el);
var STENCIL_DEV_MODE = BUILD.isTesting ? ["STENCIL:"] : [
  "%cstencil",
  "color: white;background:#4c47ff;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px"
];
var win2 = typeof window !== "undefined" ? window : {};
var doc2 = win2.document || { head: {} };
var H = win2.HTMLElement || class {
};
var plt = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (h2) => h2(),
  raf: (h2) => requestAnimationFrame(h2),
  ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
  rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
  ce: (eventName, opts) => new CustomEvent(eventName, opts)
};
var supportsShadow = BUILD.shadowDom;
var supportsListenerOptions = (() => {
  let supportsListenerOptions2 = false;
  try {
    doc2.addEventListener(
      "e",
      null,
      Object.defineProperty({}, "passive", {
        get() {
          supportsListenerOptions2 = true;
        }
      })
    );
  } catch (e) {
  }
  return supportsListenerOptions2;
})();
var promiseResolve = (v) => Promise.resolve(v);
var supportsConstructableStylesheets = BUILD.constructableCSS ? (() => {
  try {
    new CSSStyleSheet();
    return typeof new CSSStyleSheet().replaceSync === "function";
  } catch (e) {
  }
  return false;
})() : false;
var queueCongestion = 0;
var queuePending = false;
var queueDomReads = [];
var queueDomWrites = [];
var queueDomWritesLow = [];
var queueTask = (queue, write) => (cb) => {
  queue.push(cb);
  if (!queuePending) {
    queuePending = true;
    if (write && plt.$flags$ & 4) {
      nextTick(flush);
    } else {
      plt.raf(flush);
    }
  }
};
var consume = (queue) => {
  for (let i2 = 0; i2 < queue.length; i2++) {
    try {
      queue[i2](performance.now());
    } catch (e) {
      consoleError(e);
    }
  }
  queue.length = 0;
};
var consumeTimeout = (queue, timeout) => {
  let i2 = 0;
  let ts = 0;
  while (i2 < queue.length && (ts = performance.now()) < timeout) {
    try {
      queue[i2++](ts);
    } catch (e) {
      consoleError(e);
    }
  }
  if (i2 === queue.length) {
    queue.length = 0;
  } else if (i2 !== 0) {
    queue.splice(0, i2);
  }
};
var flush = () => {
  if (BUILD.asyncQueue) {
    queueCongestion++;
  }
  consume(queueDomReads);
  if (BUILD.asyncQueue) {
    const timeout = (plt.$flags$ & 6) === 2 ? performance.now() + 14 * Math.ceil(queueCongestion * (1 / 10)) : Infinity;
    consumeTimeout(queueDomWrites, timeout);
    consumeTimeout(queueDomWritesLow, timeout);
    if (queueDomWrites.length > 0) {
      queueDomWritesLow.push(...queueDomWrites);
      queueDomWrites.length = 0;
    }
    if (queuePending = queueDomReads.length + queueDomWrites.length + queueDomWritesLow.length > 0) {
      plt.raf(flush);
    } else {
      queueCongestion = 0;
    }
  } else {
    consume(queueDomWrites);
    if (queuePending = queueDomReads.length > 0) {
      plt.raf(flush);
    }
  }
};
var nextTick = (cb) => promiseResolve().then(cb);
var readTask = queueTask(queueDomReads, false);
var writeTask = queueTask(queueDomWrites, true);
var result_exports = {};
__export(result_exports, {
  err: () => err,
  map: () => map,
  ok: () => ok,
  unwrap: () => unwrap,
  unwrapErr: () => unwrapErr
});
var ok = (value) => ({
  isOk: true,
  isErr: false,
  value
});
var err = (value) => ({
  isOk: false,
  isErr: true,
  value
});
function map(result, fn) {
  if (result.isOk) {
    const val = fn(result.value);
    if (val instanceof Promise) {
      return val.then((newVal) => ok(newVal));
    } else {
      return ok(val);
    }
  }
  if (result.isErr) {
    const value = result.value;
    return err(value);
  }
  throw "should never get here";
}
var unwrap = (result) => {
  if (result.isOk) {
    return result.value;
  } else {
    throw result.value;
  }
};
var unwrapErr = (result) => {
  if (result.isErr) {
    return result.value;
  } else {
    throw result.value;
  }
};
var getMode = (ref) => getHostRef(ref).$modeName$;
var CAPTURE_EVENT_SUFFIX = "Capture";
var CAPTURE_EVENT_REGEX = new RegExp(CAPTURE_EVENT_SUFFIX + "$");

// node_modules/@ionic/core/components/ionic-global.js
var Config = class {
  constructor() {
    this.m = /* @__PURE__ */ new Map();
  }
  reset(configObj) {
    this.m = new Map(Object.entries(configObj));
  }
  get(key, fallback) {
    const value = this.m.get(key);
    return value !== void 0 ? value : fallback;
  }
  getBoolean(key, fallback = false) {
    const val = this.m.get(key);
    if (val === void 0) {
      return fallback;
    }
    if (typeof val === "string") {
      return val === "true";
    }
    return !!val;
  }
  getNumber(key, fallback) {
    const val = parseFloat(this.m.get(key));
    return isNaN(val) ? fallback !== void 0 ? fallback : NaN : val;
  }
  set(key, value) {
    this.m.set(key, value);
  }
};
var config = new Config();
var getPlatforms = (win3) => setupPlatforms(win3);
var isPlatform = (winOrPlatform, platform) => {
  if (typeof winOrPlatform === "string") {
    platform = winOrPlatform;
    winOrPlatform = void 0;
  }
  return getPlatforms(winOrPlatform).includes(platform);
};
var setupPlatforms = (win3 = window) => {
  if (typeof win3 === "undefined") {
    return [];
  }
  win3.Ionic = win3.Ionic || {};
  let platforms = win3.Ionic.platforms;
  if (platforms == null) {
    platforms = win3.Ionic.platforms = detectPlatforms(win3);
    platforms.forEach((p) => win3.document.documentElement.classList.add(`plt-${p}`));
  }
  return platforms;
};
var detectPlatforms = (win3) => {
  const customPlatformMethods = config.get("platform");
  return Object.keys(PLATFORMS_MAP).filter((p) => {
    const customMethod = customPlatformMethods === null || customPlatformMethods === void 0 ? void 0 : customPlatformMethods[p];
    return typeof customMethod === "function" ? customMethod(win3) : PLATFORMS_MAP[p](win3);
  });
};
var isMobileWeb = (win3) => isMobile(win3) && !isHybrid(win3);
var isIpad = (win3) => {
  if (testUserAgent(win3, /iPad/i)) {
    return true;
  }
  if (testUserAgent(win3, /Macintosh/i) && isMobile(win3)) {
    return true;
  }
  return false;
};
var isIphone = (win3) => testUserAgent(win3, /iPhone/i);
var isIOS = (win3) => testUserAgent(win3, /iPhone|iPod/i) || isIpad(win3);
var isAndroid = (win3) => testUserAgent(win3, /android|sink/i);
var isAndroidTablet = (win3) => {
  return isAndroid(win3) && !testUserAgent(win3, /mobile/i);
};
var isPhablet = (win3) => {
  const width = win3.innerWidth;
  const height = win3.innerHeight;
  const smallest = Math.min(width, height);
  const largest = Math.max(width, height);
  return smallest > 390 && smallest < 520 && largest > 620 && largest < 800;
};
var isTablet = (win3) => {
  const width = win3.innerWidth;
  const height = win3.innerHeight;
  const smallest = Math.min(width, height);
  const largest = Math.max(width, height);
  return isIpad(win3) || isAndroidTablet(win3) || smallest > 460 && smallest < 820 && largest > 780 && largest < 1400;
};
var isMobile = (win3) => matchMedia(win3, "(any-pointer:coarse)");
var isDesktop = (win3) => !isMobile(win3);
var isHybrid = (win3) => isCordova(win3) || isCapacitorNative(win3);
var isCordova = (win3) => !!(win3["cordova"] || win3["phonegap"] || win3["PhoneGap"]);
var isCapacitorNative = (win3) => {
  const capacitor = win3["Capacitor"];
  return !!(capacitor === null || capacitor === void 0 ? void 0 : capacitor.isNative);
};
var isElectron = (win3) => testUserAgent(win3, /electron/i);
var isPWA = (win3) => {
  var _a;
  return !!(((_a = win3.matchMedia) === null || _a === void 0 ? void 0 : _a.call(win3, "(display-mode: standalone)").matches) || win3.navigator.standalone);
};
var testUserAgent = (win3, expr) => expr.test(win3.navigator.userAgent);
var matchMedia = (win3, query) => {
  var _a;
  return (_a = win3.matchMedia) === null || _a === void 0 ? void 0 : _a.call(win3, query).matches;
};
var PLATFORMS_MAP = {
  ipad: isIpad,
  iphone: isIphone,
  ios: isIOS,
  android: isAndroid,
  phablet: isPhablet,
  tablet: isTablet,
  cordova: isCordova,
  capacitor: isCapacitorNative,
  electron: isElectron,
  pwa: isPWA,
  mobile: isMobile,
  mobileweb: isMobileWeb,
  desktop: isDesktop,
  hybrid: isHybrid
};
var defaultMode;
var getIonMode = (ref) => {
  return ref && getMode(ref) || defaultMode;
};

// node_modules/@ionic/core/components/index6.js
var printIonWarning = (message, ...params) => {
  return console.warn(`[Ionic Warning]: ${message}`, ...params);
};

// node_modules/@ionic/core/components/helpers.js
var componentOnReady = (el, callback) => {
  if (el.componentOnReady) {
    el.componentOnReady().then((resolvedEl) => callback(resolvedEl));
  } else {
    raf(() => callback(el));
  }
};
var raf = (h) => {
  if (typeof __zone_symbol__requestAnimationFrame === "function") {
    return __zone_symbol__requestAnimationFrame(h);
  }
  if (typeof requestAnimationFrame === "function") {
    return requestAnimationFrame(h);
  }
  return setTimeout(h);
};

// node_modules/@ionic/core/components/index2.js
var LIFECYCLE_WILL_ENTER = "ionViewWillEnter";
var LIFECYCLE_DID_ENTER = "ionViewDidEnter";
var LIFECYCLE_WILL_LEAVE = "ionViewWillLeave";
var LIFECYCLE_DID_LEAVE = "ionViewDidLeave";
var LIFECYCLE_WILL_UNLOAD = "ionViewWillUnload";
var moveFocus = (el) => {
  el.tabIndex = -1;
  el.focus();
};
var isVisible = (el) => {
  return el.offsetParent !== null;
};
var createFocusController = () => {
  const saveViewFocus = (referenceEl) => {
    const focusManagerEnabled = config.get("focusManagerPriority", false);
    if (focusManagerEnabled) {
      const activeEl = document.activeElement;
      if (activeEl !== null && (referenceEl === null || referenceEl === void 0 ? void 0 : referenceEl.contains(activeEl))) {
        activeEl.setAttribute(LAST_FOCUS, "true");
      }
    }
  };
  const setViewFocus = (referenceEl) => {
    const focusManagerPriorities = config.get("focusManagerPriority", false);
    if (Array.isArray(focusManagerPriorities) && !referenceEl.contains(document.activeElement)) {
      const lastFocus = referenceEl.querySelector(`[${LAST_FOCUS}]`);
      if (lastFocus && isVisible(lastFocus)) {
        moveFocus(lastFocus);
        return;
      }
      for (const priority of focusManagerPriorities) {
        switch (priority) {
          case "content":
            const content = referenceEl.querySelector('main, [role="main"]');
            if (content && isVisible(content)) {
              moveFocus(content);
              return;
            }
            break;
          case "heading":
            const headingOne = referenceEl.querySelector('h1, [role="heading"][aria-level="1"]');
            if (headingOne && isVisible(headingOne)) {
              moveFocus(headingOne);
              return;
            }
            break;
          case "banner":
            const header = referenceEl.querySelector('header, [role="banner"]');
            if (header && isVisible(header)) {
              moveFocus(header);
              return;
            }
            break;
          default:
            printIonWarning(`Unrecognized focus manager priority value ${priority}`);
            break;
        }
      }
      moveFocus(referenceEl);
    }
  };
  return {
    saveViewFocus,
    setViewFocus
  };
};
var LAST_FOCUS = "ion-last-focus";
var focusController = createFocusController();
var getIonPageElement = (element) => {
  if (element.classList.contains("ion-page")) {
    return element;
  }
  const ionPage = element.querySelector(":scope > .ion-page, :scope > ion-nav, :scope > ion-tabs");
  if (ionPage) {
    return ionPage;
  }
  return element;
};

export {
  doc,
  createAnimation,
  getPlatforms,
  isPlatform,
  getIonMode,
  printIonWarning,
  componentOnReady,
  LIFECYCLE_WILL_ENTER,
  LIFECYCLE_DID_ENTER,
  LIFECYCLE_WILL_LEAVE,
  LIFECYCLE_DID_LEAVE,
  LIFECYCLE_WILL_UNLOAD,
  getIonPageElement
};
/*! Bundled license information:

@ionic/core/components/index5.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)

@ionic/core/components/animation.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)

@ionic/core/components/ionic-global.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)

@ionic/core/components/index6.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)

@ionic/core/components/helpers.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)

@ionic/core/components/index2.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
//# sourceMappingURL=chunk-2J7VHZNX.js.map
