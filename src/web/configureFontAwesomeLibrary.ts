import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck, faTrashCan as farTranshCan } from '@fortawesome/free-regular-svg-icons';
import {
  faAngleLeft,
  faAngleRight,
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleCheck as fasCircleCheck,
  faCircleInfo,
  faCopy,
  faEllipsisH,
  faExclamationCircle,
  faEye,
  faKey,
  faMinus,
  faPencil,
  faPlus,
  faSearch,
  faLock,
  faRedo,
  faSort,
  faSortDown,
  faSortUp,
  faSpinner,
  faTrashCan,
  faTriangleExclamation,
  faXmark,
  faRotateRight,
  faArrowsRotate,
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
  library.add(faSort);
  library.add(faSortUp);
  library.add(faSortDown);
  library.add(faSpinner);
  library.add(faPlus);
  library.add(faCopy);
  library.add(faEye);
  library.add(faAngleRight);
  library.add(faAngleLeft);
  library.add(faTriangleExclamation);
  library.add(faKey);
  library.add(faLock);
  library.add(faRedo);
  library.add(faRotateRight);
  library.add(faArrowsRotate);
}
