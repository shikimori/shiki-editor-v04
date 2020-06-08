export default function (type) {
  return state => {
    const { from, $from, to, empty } = state.selection;
    if (empty) {
      return type.isInSet(state.storedMarks || $from.marks());
    }
    return state.doc.rangeHasMark(from, to, type);
  };
}
