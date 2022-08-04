/**
 * Plugin channels Lunar Client uses
 * to establish the connection between
 * the client and the server
 */
export enum LunarClientPluginChannel {
  /**
   * New plugin channel, recommended
   *
   * Value: `lunarclient:pm`
   */
  NEW = 'lunarclient:pm',
  /**
   * Old plugin channel, shouldn't be
   * used today but the connection seems
   * to be established anyway.
   *
   * Value: `Lunar-Client`
   * @deprecated
   */
  OLD = 'Lunar-Client',
}

/**
 * Status code used by the VoiceChannelUpdatePacket
 */
export enum VoiceChannelUpdateStatus {
  PLAYER_ADD = 0,
  PLAYER_REMOVE = 1,
  PLAYER_LISTENING = 2,
  PLAYER_DEAFENED = 3,
}

/**
 * Different level the notification could be
 */
export enum NotificationLevel {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

/**
 * List of all server rules
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/obj/ServerRule.java
 */
export enum ServerRuleEnum {
  /**
   * Whether or not minimap is allowed.
   * Expected value: (String) `NEUTRAL` or `FORCED_OFF`
   */
  MINIMAP_STATUS = 'minimapStatus',
  /**
   * Whether or not the server will store waypoints, instead of the client
   */
  SERVER_HANDLES_WAYPOINTS = 'serverHandlesWaypoints',
  /**
   * A warning message will be shown when attempting to disconnect if the current
   * game is competitive.
   */
  COMPETITIVE_GAME = 'competitiveGame',
  /**
   * If this server forces shaders to be disabled
   */
  SHADERS_DISABLED = 'shadersDisabled',
  /**
   * If the server runs legacy enchanting (pre 1.8)
   */
  LEGACY_ENCHANTING = 'legacyEnchanting',
  /**
   * If this server has enabled voice chat
   */
  VOICE_ENABLED = 'voiceEnabled',
  /**
   * Whether to revert combat mechanics to 1.7
   */
  LEGACY_COMBAT = 'legacyCombat',
}

export type ServerRuleValue = 'boolean' | 'int' | 'float' | 'string';

/**
 * MinimapStatus values for the server rule
 */
export enum MiniMapStatus {
  NEUTRAL = 'NEUTRAL',
  FORCED_OFF = 'FORCED_OFF',
}

/**
 * List of all the staff mods
 */
export enum StaffMod {
  XRAY = 'XRAY',
  /** @deprecated Not in the game anymore */
  NAME_TAGS = 'NAME_TAGS',
  /** @deprecated Not in the game anymore */
  BUNNY_HOP = 'BUNNY_HOP',
}

/**
 * List of all Lunar Client mods
 *
 * Some of them are not present anymore be careful!
 */
export enum LunarClientMod {
  TIME_CHANGER = 'time_changer',
  NEU = 'neu',
  NAMETAG = 'nametag',
  SHINY_POTS = 'shinyPots',
  BLOCK_OUTLINE = 'block_outline',
  HYPIXEL_MOD = 'hypixel_mod',
  RANGE = 'range',
  REPLAYMOD = 'replaymod',
  RECORDING_INDICATOR = 'recording_indicator',
  PARTICLE_MOD = 'particleMod',
  FOV_MOD = 'fov_mod',
  MOMENTUM_MOD = 'momentum_mod',
  SCREENSHOT = 'screenshot',
  LIGHTING = 'lighting',
  ARMORSTATUS = 'armorstatus',
  ITEM_PHYSIC = 'itemPhysic',
  PACK_ORGANIZER = 'pack_organizer',
  STAFF_XRAY = 'staff.XRAY',
  TITLE_MOD = 'titleMod',
  FPS = 'fps',
  TAB = 'tab',
  COOLDOWNS = 'cooldowns',
  CROSSHAIR = 'crosshair',
  CHAT = 'chat',
  HYPIXEL_BEDWARS = 'hypixel_bedwars',
  COMBO = 'combo',
  SOUND_CHANGER = 'sound_changer',
  SCOREBOARD = 'scoreboard',
  STOPWATCH = 'stopwatch',
  HITBOX = 'hitbox',
  KEYSTROKES = 'keystrokes',
  SATURATION_MOD = 'saturation_mod',
  SATURATION_HUD_MOD = 'saturation_hud_mod',
  HIT_COLOR = 'hitColor',
  SNAPLOOK = 'snaplook',
  MUMBLE_LINK = 'mumble-link',
  BOSSBAR = 'bossbar',
  FREELOOK = 'freelook',
  SCROLLABLE_TOOLTIPS = 'scrollable_tooltips',
  ITEMS2D = 'items2d',
  DAYCOUNTER = 'daycounter',
  SKIN_LAYERS_3D = 'skinLayers3D',
  WEATHER_CHANGER = 'weather_changer',
  CPS = 'cps',
  CLOCK = 'clock',
  TOGGLE_SNEAK = 'toggleSneak',
  MENU_BLUR = 'menu_blur',
  DIRECTIONHUD = 'directionhud',
  TEAMVIEW = 'teamview',
  COORDS = 'coords',
  NICK_HIDER = 'nickHider',
  COLORSATURATION = 'colorsaturation',
  CHUNKBORDERS = 'chunkborders',
  RESOURCE_DISPLAY = 'resource_display',
  SKYBLOCK_ADDONS = 'skyblockAddons',
  QUICKPLAY = 'quickplay',
  TEXT_HOT_KEY = 'textHotKey',
  POTIONEFFECTS = 'potioneffects',
  TNT_COUNTDOWN = 'tntCountdown',
  MOTION_BLUR = 'motionBlur',
  ZOOM = 'zoom',
  WAYPOINTS = 'waypoints',
  PING = 'ping',
  WORLDEDIT_CUI = 'worldedit_cui',
  SERVER_ADDRESS_MOD = 'serverAddressMod',
  MEMORY = 'memory',
  GLINT_COLORIZER = 'glint_colorizer',
  PANORAMA_MAKER = 'panorama_maker',
  ITEM_TRACKER_CHILD = 'itemTrackerChild',
  UHC_OVERLAY = 'uhc_overlay',
  HOLOGRAMS = 'holograms',
  BORDERS = 'borders',
  CUSTOM_NAMEPLATE = 'custom_nameplate',
  COMP_WARN = 'comp_warn',
  VOICE = 'voice',
  TITLES = 'titles',
}

/**
 * Waypoint object. Used when creating waypoints.
 */
export interface Waypoint {
  /**
   * Name of the waypoint
   */
  name: string;
  /**
   * X coordinate of the waypoint
   */
  x: number;
  /**
   * Y coordinate of the waypoint
   */
  y: number;
  /**
   * Z coordinate of the waypoint
   */
  z: number;
  /**
   * Color of the waypoint
   */
  color: number;
  /**
   * I don't really know what this is, if you know please tell me or open a pull request with this comment changed
   */
  forced: boolean;
  /**
   * If the waypoint is visible
   */
  visible: boolean;
}

export interface TeammatePlayer {
  /** UUID of the player */
  uuid: string;
  /** X fallback value when the player is out of render distance */
  x?: number;
  /** Y fallback value when the player is out of render distance */
  y?: number;
  /** Z fallback value when the player is out of render distance */
  z?: number;
}
