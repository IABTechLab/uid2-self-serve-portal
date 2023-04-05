import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck,
  faChevronDown,
  faChevronUp,
  faEllipsisH,
  faPencil,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

export function configureFontAwesomeLibrary(): void {
  library.add(faCircleCheck);
  library.add(faCheck);
  library.add(faEllipsisH);
  library.add(faPencil);
  library.add(faTrashCan);
  library.add(faChevronDown);
  library.add(faXmark);
  library.add(faChevronUp);
}
