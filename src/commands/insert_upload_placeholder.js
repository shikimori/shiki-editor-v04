export default function(state, dispatch, { uploadId, file }) {
  // Replace the selection with a placeholder
  const placeholderPlugin = state
    .plugins
    .find(v => v.key.includes('upload_placeholder'));

  let tr = state.tr;
  if (!tr.selection.empty) tr.deleteSelection();
  tr.setMeta(placeholderPlugin, {
    add: {
      uploadId,
      file,
      pos: tr.selection.from
    }
  });
  dispatch(tr);
}
