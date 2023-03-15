import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faEllipsisH,
  faPencil,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';

export function configureFontAwesomeLibrary(): void {
  library.add(faEllipsisH);
  library.add(faPencil);
  library.add(faTrashCan);
  library.add(faChevronDown);
}
