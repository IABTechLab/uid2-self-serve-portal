export function getRoleNamesByIds(ids: number[]) {
  const names: string[] = ids.map((item) => {
    switch (item) {
      case 1:
        return 'Mapper';
      case 2:
        return 'Generator';
      case 3:
        return 'Bidder';
      case 4:
        return 'Sharer';
      default:
        return 'Invalid';
    }
  });
  return names;
}
