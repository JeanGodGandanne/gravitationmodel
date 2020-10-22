export enum LayerIdentifier {
  FILIALEN_OFFEN = 'fil_offen',
  FILIALEN_GESCHLOSSEN = 'fil_gesch',
  FILIALEN_ENDABGEWICKELT = 'fil_endab',

// Lidl Business Objects -> Objekte
  OBJEKTE_UNTER_VERTRAG = 'obj_uver',
  OBJEKTE_KEINE_REALISIERUNGSABSICHT = 'obj_kreal',

// Lidl Business Objects -> Einzugsgebiete -> Filialen
  EINZUGSBEREICHE_FILIALEN_OFFEN = 'ezb_fil_offen',
  EINZUGSBEREICHE_FILIALEN_GESCHLOSSEN = 'ezb_fil_gesch',
  EINZUGSBEREICHE_FILIALEN_ENDABGEWICKELT = 'ezb_fil_endab',

// Lidl Business Objects -> Einzugsgebiete -> Objekte
  EINZUGSBEREICHE_OBJEKTE_UNTER_VERTRAG = 'ezb_obj_uver',
  EINZUGSBEREICHE_OBJEKTE_KEINE_REALISIERUNGSABSICHT = 'ezb_obj_kreal',

// Wettbewerber
  WETTBEWERBER_OFFEN = 'wett_offen',
  WETTBEWERBER_IM_BAU = 'wett_bau',
  WETTBEWERBER_TEMPORAER_GESCHLOSSEN = 'wett_tmpg',
  WETTBEWERBER_GESCHLOSSEN = 'wett_gesch',

// Kundendaten
  KUNDENBEFRAGUNG = 'kundbef',

// Marktdaten
  POSTLEITZAHLGEBIETE = 'plz',
  STATISTISCHE_BEZIRKE = 'std_bzk',
  GEMEINDEN = 'gemein',
  KREISE = 'kreise',
  REGIERUNGSBEZIRKE = 'reg_bzk',
  BUNDESLAENDER = 'bu_lndr',
  LANDESGRENZEN = 'lnd_grenz',
  STADTREGIONEN = 'std_reg',

// Analysedaten
  FAHRZEITENZONEN = 'fzz',
  MANUELLE_GEBIETE = 'man_geb',

// Hintergrundkarte
  HINTERGRUNDKARTE = 'hintergrundkarte',

// Andere
  MESSTOOL = 'messtool',
  POLYGON = 'polygon',
  DEBUG = 'debug',
  ARBEITSLAYER = 'arbeitslayer'
}
