import './styles/tokens.css';
import { applyLang, detectLang, readStoredLang } from './i18n';

applyLang(document, detectLang(navigator.language, readStoredLang()));
