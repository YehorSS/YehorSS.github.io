import './styles/tokens.css';
import './styles/layout.css';
import './styles/records.css';
import { applyLang, detectLang, readStoredLang } from './i18n';
import { renderArchive, renderBridge } from './render';

const $ = (id: string) => document.getElementById(id)!;

renderBridge($('deck-bridge'));
renderArchive($('deck-archive'));
applyLang(document, detectLang(navigator.language, readStoredLang()));
