import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleInfo,
  faEllipsisH,
  faPencil,
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
  library.add(faChevronDown);
  library.add(faXmark);
  library.add(faChevronUp);
  library.add(faCircleInfo);
}
