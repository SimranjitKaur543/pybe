import '../style.css';
import './opening.css';
import './whisper.css';
import './courtyard.css';
import './magic.css';
import './lesson.css';
import './ending.css';
import { mountStory } from './SceneManager.js';

mountStory(document.getElementById('app'));
