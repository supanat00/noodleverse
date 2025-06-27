// node_modules/@cloudinary/transformation-builder-sdk/internal/qualifier/QualifierValue.js
var QualifierValue = class {
  /**
   *
   * @param {QualifierValue | QualifierValue[] | any[] | string | number}qualifierValue
   */
  constructor(qualifierValue) {
    this.values = [];
    this.delimiter = ":";
    if (this.hasValue(qualifierValue)) {
      this.addValue(qualifierValue);
    }
  }
  /**
   * @description Joins the provided values with the provided delimiter
   */
  toString() {
    return this.values.join(this.delimiter);
  }
  /**
   * @description Checks if the provided argument has a value
   * @param {any} v
   * @private
   * @return {boolean}
   */
  hasValue(v) {
    return typeof v !== "undefined" && v !== null && v !== "";
  }
  /**
   * @desc Adds a value for the this qualifier instance
   * @param {any} value
   * @return {this}
   */
  addValue(value) {
    if (Array.isArray(value)) {
      this.values = this.values.concat(value);
    } else {
      this.values.push(value);
    }
    this.values = this.values.filter((v) => this.hasValue(v));
    return this;
  }
  /**
   * @description Sets the delimiter for this instance
   * @param delimiter
   */
  setDelimiter(delimiter) {
    this.delimiter = delimiter;
    return this;
  }
};

// node_modules/@cloudinary/transformation-builder-sdk/internal/utils/unsupportedError.js
var UnsupportedError = class extends Error {
  constructor(message = "Unsupported") {
    super(message);
  }
};
function createUnsupportedError(message) {
  return new UnsupportedError(message);
}

// node_modules/@cloudinary/transformation-builder-sdk/internal/models/qualifierToJson.js
function qualifierToJson() {
  return this._qualifierModel || { error: createUnsupportedError(`unsupported qualifier ${this.constructor.name}`) };
}

// node_modules/@cloudinary/transformation-builder-sdk/internal/models/QualifierModel.js
var QualifierModel = class {
  constructor() {
    this._qualifierModel = {};
  }
  toJson() {
    return qualifierToJson.apply(this);
  }
};

// node_modules/@cloudinary/transformation-builder-sdk/internal/qualifier/Qualifier.js
var Qualifier = class extends QualifierModel {
  constructor(key, qualifierValue) {
    super();
    this.delimiter = "_";
    this.key = key;
    if (qualifierValue instanceof QualifierValue) {
      this.qualifierValue = qualifierValue;
    } else {
      this.qualifierValue = new QualifierValue();
      this.qualifierValue.addValue(qualifierValue);
    }
  }
  toString() {
    const { key, delimiter, qualifierValue } = this;
    return `${key}${delimiter}${qualifierValue.toString()}`;
  }
  addValue(value) {
    this.qualifierValue.addValue(value);
    return this;
  }
};

// node_modules/@cloudinary/transformation-builder-sdk/qualifiers/flag/FlagQualifier.js
var FlagQualifier = class extends Qualifier {
  constructor(flagType, flagValue) {
    let qualifierValue;
    if (flagValue) {
      qualifierValue = new QualifierValue([flagType, `${flagValue}`]).setDelimiter(":");
    } else {
      qualifierValue = flagType;
    }
    super("fl", qualifierValue);
    this.flagValue = flagValue;
  }
  toString() {
    return super.toString().replace(/\./g, "%2E");
  }
  getFlagValue() {
    return this.flagValue;
  }
};

// node_modules/@cloudinary/transformation-builder-sdk/qualifiers/flag.js
function animated() {
  return new FlagQualifier("animated");
}
function animatedWebP() {
  return new FlagQualifier("awebp");
}
function clip() {
  return new FlagQualifier("clip");
}
function clipEvenOdd() {
  return new FlagQualifier("clip_evenodd");
}
function ignoreInitialAspectRatio() {
  return new FlagQualifier("ignore_aspect_ratio");
}
function lossy() {
  return new FlagQualifier("lossy");
}
function noOverflow() {
  return new FlagQualifier("no_overflow");
}
function preserveTransparency() {
  return new FlagQualifier("preserve_transparency");
}
function progressive(mode) {
  return new FlagQualifier("progressive", mode);
}
function regionRelative() {
  return new FlagQualifier("region_relative");
}
function relative() {
  return new FlagQualifier("relative");
}
function tiled() {
  return new FlagQualifier("tiled");
}

// node_modules/@cloudinary/transformation-builder-sdk/internal/utils/dataStructureUtils.js
function mapToSortedArray(map, flags) {
  const array = Array.from(map.entries());
  flags.forEach((flag) => {
    array.push(["fl", flag]);
  });
  return array.sort().map((v) => v[1]);
}

// node_modules/@cloudinary/transformation-builder-sdk/internal/models/actionToJson.js
function actionToJson() {
  var _a, _b, _c;
  const actionModelIsNotEmpty = this._actionModel && Object.keys(this._actionModel).length;
  const sourceTransformationError = (_c = (_b = (_a = this._actionModel) === null || _a === void 0 ? void 0 : _a.source) === null || _b === void 0 ? void 0 : _b.transformation) === null || _c === void 0 ? void 0 : _c.error;
  if (sourceTransformationError && sourceTransformationError instanceof Error) {
    return { error: sourceTransformationError };
  }
  if (actionModelIsNotEmpty) {
    return this._actionModel;
  }
  return { error: createUnsupportedError(`unsupported action ${this.constructor.name}`) };
}

// node_modules/@cloudinary/transformation-builder-sdk/internal/models/ActionModel.js
var ActionModel = class {
  constructor() {
    this._actionModel = {};
  }
  toJson() {
    return actionToJson.apply(this);
  }
};

// node_modules/@cloudinary/transformation-builder-sdk/internal/Action.js
var Action = class extends ActionModel {
  constructor() {
    super(...arguments);
    this.qualifiers = /* @__PURE__ */ new Map();
    this.flags = [];
    this.delimiter = ",";
    this.actionTag = "";
  }
  prepareQualifiers() {
  }
  /**
   * @description Returns the custom name tag that was given to this action
   * @return {string}
   */
  getActionTag() {
    return this.actionTag;
  }
  /**
   * @description Sets the custom name tag for this action
   * @return {this}
   */
  setActionTag(tag) {
    this.actionTag = tag;
    return this;
  }
  /**
   * @description Calls toString() on all child qualifiers (implicitly by using .join()).
   * @return {string}
   */
  toString() {
    this.prepareQualifiers();
    return mapToSortedArray(this.qualifiers, this.flags).join(this.delimiter);
  }
  /**
   * @description Adds the parameter to the action.
   * @param {SDK.Qualifier} qualifier
   * @return {this}
   */
  addQualifier(qualifier) {
    if (typeof qualifier === "string") {
      const [key, value] = qualifier.toLowerCase().split("_");
      if (key === "fl") {
        this.flags.push(new FlagQualifier(value));
      } else {
        this.qualifiers.set(key, new Qualifier(key, value));
      }
    } else {
      this.qualifiers.set(qualifier.key, qualifier);
    }
    return this;
  }
  /**
   * @description Adds a flag to the current action.
   * @param {Qualifiers.Flag} flag
   * @return {this}
   */
  addFlag(flag) {
    if (typeof flag === "string") {
      this.flags.push(new FlagQualifier(flag));
    } else {
      if (flag instanceof FlagQualifier) {
        this.flags.push(flag);
      }
    }
    return this;
  }
  addValueToQualifier(qualifierKey, qualifierValue) {
    this.qualifiers.get(qualifierKey).addValue(qualifierValue);
    return this;
  }
};

// node_modules/@cloudinary/transformation-builder-sdk/qualifiers/format/FormatQualifier.js
var FormatQualifier = class extends QualifierValue {
  constructor(val) {
    super(val);
    this.val = val;
  }
  getValue() {
    return this.val;
  }
};

// node_modules/@cloudinary/transformation-builder-sdk/internal/utils/objectFlip.js
function objectFlip(obj) {
  const result = {};
  Object.keys(obj).forEach((key) => {
    result[obj[key]] = key;
  });
  return result;
}

// node_modules/@cloudinary/transformation-builder-sdk/internal/internalConstants.js
var CONDITIONAL_OPERATORS = {
  "=": "eq",
  "!=": "ne",
  "<": "lt",
  ">": "gt",
  "<=": "lte",
  ">=": "gte",
  "&&": "and",
  "||": "or",
  "*": "mul",
  "/": "div",
  "+": "add",
  "-": "sub",
  "^": "pow"
};
var RESERVED_NAMES = {
  "aspect_ratio": "ar",
  "aspectRatio": "ar",
  "current_page": "cp",
  "currentPage": "cp",
  "duration": "du",
  "face_count": "fc",
  "faceCount": "fc",
  "height": "h",
  "initial_aspect_ratio": "iar",
  "initial_height": "ih",
  "initial_width": "iw",
  "initialAspectRatio": "iar",
  "initialHeight": "ih",
  "initialWidth": "iw",
  "initial_duration": "idu",
  "initialDuration": "idu",
  "page_count": "pc",
  "page_x": "px",
  "page_y": "py",
  "pageCount": "pc",
  "pageX": "px",
  "pageY": "py",
  "tags": "tags",
  "width": "w",
  "trimmed_aspect_ratio": "tar",
  "current_public_id": "cpi",
  "initial_density": "idn",
  "page_names": "pgnames"
};
var ACTION_TYPE_TO_CROP_MODE_MAP = {
  limitFit: "limit",
  limitFill: "lfill",
  minimumFit: "mfit",
  thumbnail: "thumb",
  limitPad: "lpad",
  minimumPad: "mpad",
  autoPad: "auto_pad"
};
var ACTION_TYPE_TO_DELIVERY_MODE_MAP = {
  colorSpace: "cs",
  dpr: "dpr",
  density: "dn",
  defaultImage: "d",
  format: "f",
  quality: "q"
};
var ACTION_TYPE_TO_EFFECT_MODE_MAP = {
  redEye: "redeye",
  advancedRedEye: "adv_redeye",
  oilPaint: "oil_paint",
  unsharpMask: "unsharp_mask",
  makeTransparent: "make_transparent",
  generativeRestore: "gen_restore",
  upscale: "upscale"
};
var ACTION_TYPE_TO_QUALITY_MODE_MAP = {
  autoBest: "auto:best",
  autoEco: "auto:eco",
  autoGood: "auto:good",
  autoLow: "auto:low",
  jpegminiHigh: "jpegmini:1",
  jpegminiMedium: "jpegmini:2",
  jpegminiBest: "jpegmini:0"
};
var ACTION_TYPE_TO_STREAMING_PROFILE_MODE_MAP = {
  fullHd: "full_hd",
  fullHdWifi: "full_hd_wifi",
  fullHdLean: "full_hd_lean",
  hdLean: "hd_lean"
};
var CHROMA_VALUE_TO_CHROMA_MODEL_ENUM = {
  444: "CHROMA_444",
  420: "CHROMA_420"
};
var COLOR_SPACE_MODEL_MODE_TO_COLOR_SPACE_MODE_MAP = {
  "noCmyk": "no_cmyk",
  "keepCmyk": "keep_cmyk",
  "tinySrgb": "tinysrgb",
  "srgbTrueColor": "srgb:truecolor"
};
var ACTION_TYPE_TO_BLEND_MODE_MAP = {
  "antiRemoval": "anti_removal"
};
var CHROMA_MODEL_ENUM_TO_CHROMA_VALUE = objectFlip(CHROMA_VALUE_TO_CHROMA_MODEL_ENUM);
var COLOR_SPACE_MODE_TO_COLOR_SPACE_MODEL_MODE_MAP = objectFlip(COLOR_SPACE_MODEL_MODE_TO_COLOR_SPACE_MODE_MAP);
var CROP_MODE_TO_ACTION_TYPE_MAP = objectFlip(ACTION_TYPE_TO_CROP_MODE_MAP);
var DELIVERY_MODE_TO_ACTION_TYPE_MAP = objectFlip(ACTION_TYPE_TO_DELIVERY_MODE_MAP);
var EFFECT_MODE_TO_ACTION_TYPE_MAP = objectFlip(ACTION_TYPE_TO_EFFECT_MODE_MAP);
var QUALITY_MODE_TO_ACTION_TYPE_MAP = objectFlip(ACTION_TYPE_TO_QUALITY_MODE_MAP);
var STREAMING_PROFILE_TO_ACTION_TYPE_MAP = objectFlip(ACTION_TYPE_TO_STREAMING_PROFILE_MODE_MAP);

// node_modules/@cloudinary/transformation-builder-sdk/actions/delivery/DeliveryAction.js
var DeliveryAction = class extends Action {
  /**
   * @param {string} deliveryKey A generic Delivery Action Key (such as q, f, dn, etc.)
   * @param {string} deliveryType A Format Qualifiers for the action, such as Quality.auto()
   * @param {string} modelProperty internal model property of the action, for example quality uses `level` while dpr uses `density`
   * @see Visit {@link Actions.Delivery|Delivery} for an example
   */
  constructor(deliveryKey, deliveryType, modelProperty) {
    super();
    this._actionModel = {};
    let deliveryTypeValue;
    if (deliveryType instanceof FormatQualifier) {
      deliveryTypeValue = deliveryType.getValue();
    } else {
      deliveryTypeValue = deliveryType;
    }
    this._actionModel.actionType = DELIVERY_MODE_TO_ACTION_TYPE_MAP[deliveryKey];
    this._actionModel[modelProperty] = deliveryTypeValue;
    this.addQualifier(new Qualifier(deliveryKey, deliveryType));
  }
};

// node_modules/@cloudinary/transformation-builder-sdk/qualifiers/progressive.js
var ProgressiveQualifier = class extends FlagQualifier {
  constructor(mode) {
    super("progressive", mode);
  }
};

// node_modules/@cloudinary/transformation-builder-sdk/actions/delivery/DeliveryFormatAction.js
var DeliveryFormatAction = class extends DeliveryAction {
  constructor(deliveryKey, deliveryType) {
    super(deliveryKey, deliveryType, "formatType");
  }
  /**
   * @description Uses lossy compression when delivering animated GIF files.
   * @return {this}
   */
  lossy() {
    this._actionModel.lossy = true;
    this.addFlag(lossy());
    return this;
  }
  /**
   * @description Uses progressive compression when delivering JPG file format.
   * @return {this}
   */
  progressive(mode) {
    if (mode instanceof ProgressiveQualifier) {
      this._actionModel.progressive = { mode: mode.getFlagValue() };
      this.addFlag(mode);
    } else {
      this._actionModel.progressive = { mode };
      this.addFlag(progressive(mode));
    }
    return this;
  }
  /**
   * @description Ensures that images with a transparency channel are delivered in PNG format.
   */
  preserveTransparency() {
    this._actionModel.preserveTransparency = true;
    this.addFlag(preserveTransparency());
    return this;
  }
  static fromJson(actionModel) {
    const { formatType, lossy: lossy2, progressive: progressive2, preserveTransparency: preserveTransparency2 } = actionModel;
    let result;
    if (formatType) {
      result = new this("f", formatType);
    } else {
      result = new this("f");
    }
    if (progressive2) {
      if (progressive2.mode) {
        result.progressive(progressive2.mode);
      } else {
        result.progressive();
      }
    }
    lossy2 && result.lossy();
    preserveTransparency2 && result.preserveTransparency();
    return result;
  }
};

// node_modules/@cloudinary/transformation-builder-sdk/actions/delivery/DeliveryQualityAction.js
var DeliveryQualityAction = class extends DeliveryAction {
  /**
   * @param {Qualifiers.Quality} qualityValue a Quality value
   */
  constructor(qualityValue) {
    super("q", qualityValue.toString(), "level");
  }
  /**
   * Selet the Chroma sub sampling</br>
   * <b>Learn more</b>: {@link https://cloudinary.com/documentation/image_optimization#toggle_chroma_subsampling|Toggling chroma subsampling}
   * @param {420 | 444 | number} type The chroma sub sampling type
   */
  chromaSubSampling(type) {
    this._actionModel.chromaSubSampling = CHROMA_VALUE_TO_CHROMA_MODEL_ENUM[type];
    const qualityWithSubSampling = new QualifierValue([this._actionModel.level, type]);
    qualityWithSubSampling.setDelimiter(":");
    return this.addQualifier(new Qualifier("q", qualityWithSubSampling));
  }
  /**
   * Controls the final quality by setting a maximum quantization percentage
   * @param {number} val
   */
  quantization(val) {
    this._actionModel.quantization = val;
    const qualityWithQuantization = new QualifierValue([this._actionModel.level, `qmax_${val}`]).setDelimiter(":");
    return this.addQualifier(new Qualifier("q", qualityWithQuantization));
  }
  static fromJson(actionModel) {
    const { level, chromaSubSampling, quantization } = actionModel;
    const levelType = ACTION_TYPE_TO_QUALITY_MODE_MAP[level] || level;
    const result = new this(levelType);
    if (chromaSubSampling) {
      const chromaValue = CHROMA_MODEL_ENUM_TO_CHROMA_VALUE[chromaSubSampling.toUpperCase()];
      chromaValue && result.chromaSubSampling(+chromaValue);
    }
    quantization && result.quantization(quantization);
    return result;
  }
};

// node_modules/@cloudinary/transformation-builder-sdk/actions/delivery/DeliveryColorSpaceFromICCAction.js
var DeliveryColorSpaceFromICCAction = class extends Action {
  /**
   * @param {string} publicId
   */
  constructor(publicId) {
    super();
    this._actionModel = {};
    this._actionModel.actionType = "colorSpaceFromICC";
    this._actionModel.publicId = publicId;
    const qualifierValue = new QualifierValue(["icc", publicId]).setDelimiter(":");
    this.addQualifier(new Qualifier("cs", qualifierValue));
  }
  static fromJson(actionModel) {
    const { publicId } = actionModel;
    return new this(publicId);
  }
};

// node_modules/@cloudinary/transformation-builder-sdk/qualifiers/colorSpace.js
function srgb() {
  return "srgb";
}
function trueColor() {
  return "srgb:truecolor";
}
function tinySrgb() {
  return "tinysrgb";
}
function cmyk() {
  return "cmyk";
}
function noCmyk() {
  return "no_cmyk";
}
function keepCmyk() {
  return "keep_cmyk";
}
var ColorSpace = {
  cmyk,
  keepCmyk,
  noCmyk,
  srgb,
  tinySrgb,
  trueColor
};

// node_modules/@cloudinary/transformation-builder-sdk/actions/delivery/DeliveryColorSpaceAction.js
var DeliveryColorSpaceAction = class extends Action {
  /**
   * Create a new DeliveryColorSpaceAction
   * @param mode
   */
  constructor(mode) {
    super();
    this._actionModel = {};
    this._actionModel = {
      actionType: "colorSpace",
      mode: COLOR_SPACE_MODE_TO_COLOR_SPACE_MODEL_MODE_MAP[mode] || mode
    };
    this.addQualifier(new Qualifier("cs", ColorSpace[mode] ? ColorSpace[mode]() : mode));
  }
  static fromJson(actionModel) {
    const { mode } = actionModel;
    const colorSpaceMode = COLOR_SPACE_MODEL_MODE_TO_COLOR_SPACE_MODE_MAP[mode] || mode;
    return new this(colorSpaceMode);
  }
};

// node_modules/@cloudinary/transformation-builder-sdk/internal/utils/toFloatAsString.js
function toFloatAsString(value) {
  const returnValue = value.toString();
  if (returnValue.match(/[A-Z]/gi)) {
    return returnValue;
  }
  if (returnValue.length > 1 && returnValue[0] === "0") {
    return returnValue;
  }
  const isNumberLike = !isNaN(parseFloat(returnValue)) && returnValue.indexOf(":") === -1;
  if (isNumberLike && returnValue.indexOf(".") === -1) {
    return `${returnValue}.0`;
  } else {
    return returnValue;
  }
}

// node_modules/@cloudinary/transformation-builder-sdk/actions/delivery/DeliveryDPRAction.js
var DeliveryDPRAction = class extends Action {
  /**
   * Create a new DeliveryDPRAction
   * @param dprValue
   */
  constructor(dprValue) {
    super();
    this._actionModel = { actionType: "dpr" };
    const dprAsFloat = toFloatAsString(dprValue);
    this._actionModel.dpr = dprAsFloat;
    this.addQualifier(new Qualifier("dpr", dprAsFloat));
  }
  static fromJson(actionModel) {
    const { dpr: dpr2 } = actionModel;
    return new this(dpr2);
  }
};

// node_modules/@cloudinary/transformation-builder-sdk/actions/delivery.js
function format(format2) {
  return new DeliveryFormatAction("f", format2);
}
function dpr(dpr2) {
  return new DeliveryDPRAction(dpr2);
}
function quality(qualityType) {
  return new DeliveryQualityAction(qualityType);
}
function density(value) {
  return new DeliveryAction("dn", value, "density");
}
function defaultImage(publicIdWithExtension) {
  return new DeliveryAction("d", publicIdWithExtension, "defaultImage");
}
function colorSpace(mode) {
  return new DeliveryColorSpaceAction(mode);
}
function colorSpaceFromICC(publicId) {
  return new DeliveryColorSpaceFromICCAction(publicId);
}
var Delivery = {
  format,
  dpr,
  density,
  defaultImage,
  colorSpace,
  colorSpaceFromICC,
  quality
};

export {
  QualifierValue,
  createUnsupportedError,
  QualifierModel,
  Qualifier,
  FlagQualifier,
  animated,
  animatedWebP,
  clip,
  clipEvenOdd,
  ignoreInitialAspectRatio,
  noOverflow,
  regionRelative,
  relative,
  tiled,
  Action,
  FormatQualifier,
  CONDITIONAL_OPERATORS,
  RESERVED_NAMES,
  ACTION_TYPE_TO_CROP_MODE_MAP,
  ACTION_TYPE_TO_EFFECT_MODE_MAP,
  ACTION_TYPE_TO_STREAMING_PROFILE_MODE_MAP,
  ACTION_TYPE_TO_BLEND_MODE_MAP,
  CROP_MODE_TO_ACTION_TYPE_MAP,
  EFFECT_MODE_TO_ACTION_TYPE_MAP,
  STREAMING_PROFILE_TO_ACTION_TYPE_MAP,
  DeliveryFormatAction,
  ColorSpace,
  toFloatAsString,
  format,
  dpr,
  quality,
  density,
  defaultImage,
  colorSpace,
  colorSpaceFromICC,
  Delivery
};
//# sourceMappingURL=chunk-3SV7BTK7.js.map
