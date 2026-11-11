import './styles/tokens.css';
import './styles/layout.css';
import './styles/records.css';
import './styles/systems.css';
import { applyLang, detectLang, readStoredLang } from './i18n';
import { renderArchive, renderBridge, renderComms, renderEngineering } from './render';

const $ = (id: string) => document.getElementById(id)!;

renderBridge($('deck-bridge'));
renderArchive($('deck-archive'));
renderEngineering($('deck-engineering'));
renderComms($('deck-comms'));
applyLang(document, detectLang(navigator.language, readStoredLang()));
