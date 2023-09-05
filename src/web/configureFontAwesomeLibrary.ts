import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck, faTrashCan as farTranshCan } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleCheck as fasCircleCheck,
  faCircleInfo,
  faEllipsisH,
  faExclamationCircle,
  faExclamationTriangle,
  faMinus,
  faPencil,
  faSearch,
  faSort,
  faSortDown,
  faSortUp,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

export function configureFontAwesomeLibrary(): void {
  // @ts-ignore
  library.add(faCircleCheck);
  library.add(faCheck);
  library.add(faEllipsisH);
  library.add(faPencil);
  library.add(faTrashCan);
  library.add(farTranshCan);
  library.add(faChevronDown);
  library.add(faXmark);
  library.add(faChevronUp);
  library.add(faCircleInfo);
  library.add(faExclamationCircle);
  library.add(fasCircleCheck);
  library.add(faSearch);
  library.add(faMinus);
  library.add(faExclamationTriangle);
  library.add(faSort);
  library.add(faSortUp);
  library.add(faSortDown);
}
