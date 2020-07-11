import { uploadPlaceholder } from '../plugins';

export default function(editor, { uploadId, response }) {
  const { state } = editor;
  const { dispatch } = editor.view;
  const pos = findPlaceholder(state, uploadId);

  if (pos != null) {
    dispatch(
      state.tr
        .setMeta(uploadPlaceholder, { remove: { id: uploadId } })
    );
        // .replaceWith(pos, pos, schema.nodes.image.create({src: url}))
  } else {
    editor.commands.image(editor.options.baseUrl + response.url);
  }

  //   let pos = findPlaceholder(view.state, id)
  //   // If the content around the placeholder has been deleted, drop
  //   // the image
  //   if (pos == null) return
  //   // Otherwise, insert it at the placeholder's position, and remove
  //   // the placeholder
  //   view.dispatch(view.state.tr
  //                 .replaceWith(pos, pos, schema.nodes.image.create({src: url}))
  //                 .setMeta(placeholderPlugin, {remove: {id}}))
  // }, () => {
  //   // On failure, just clean up the placeholder
  //   view.dispatch(tr.setMeta(placeholderPlugin, {remove: {id}}))
  // })
}


function findPlaceholder(state, id) {
  const decos = uploadPlaceholder.getState(state);
  const found = decos.find(null, null, spec => spec.id == id);

  return found.length ? found[0].from : null;
}
