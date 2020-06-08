export default markType => state => {
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    return markType.isInSet(state.storedMarks || $from.marks());
  }
  return state.doc.rangeHasMark(from, to, markType);
};
