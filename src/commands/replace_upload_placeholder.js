import { uploadPlaceholder } from '../plugins';

export default function(editor, { uploadId, response }) {
  const { state } = editor;
  const { dispatch } = editor.view;
  const pos = findPlaceholder(state, uploadId);
  const url = editor.options.baseUrl + response.url;

  if (pos != null) {
    dispatch(
      state.tr
        .replaceWith(pos, pos, editor.schema.nodes.image.create({ src: url }))
        .setMeta(uploadPlaceholder, { remove: { id: uploadId } })
    );
  } else {
    editor.commands.image(url);
  }
}


function findPlaceholder(state, id) {
  const decos = uploadPlaceholder.getState(state);
  const found = decos.find(null, null, spec => spec.id == id);

  return found.length ? found[0].from : null;
}
