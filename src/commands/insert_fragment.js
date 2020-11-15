export default function insertFragment(fragment) {
  return (state, dispatch) => {
    const { $from, $to } = state.selection;
    const from = $from.pos;
    const to = $to.pos;

    dispatch(
      state.tr
        .replaceWith(from, to, fragment)
        .scrollIntoView()
    );
  };
}
