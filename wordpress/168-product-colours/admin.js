(function () {
  const root = document.getElementById('innovative-colours');
  if (!root) return;
  let counter = 0;
  function addRow(value = {}) {
    const index = counter++;
    const row = document.createElement('div');
    row.className = 'innovative-colour-row';
    function input(name, title, type, initial) {
      const label = document.createElement('label'); label.textContent = title;
      const field = document.createElement('input'); field.type = type; field.name = `innovative_colours[${index}][${name}]`; field.value = initial || '';
      label.append(field); row.append(label); return field;
    }
    input('id', '', 'hidden', value.id);
    input('name_th', 'ชื่อสี (ไทย)', 'text', value.name_th);
    input('name_en', 'ชื่อสี (อังกฤษ)', 'text', value.name_en);
    const colour = input('hex', 'รหัสสี เช่น #FFFFFF (ไม่บังคับ)', 'text', value.hex);
    colour.pattern = '#[0-9a-fA-F]{6}'; colour.placeholder = '#FFFFFF';
    const attachment = input('attachment_id', '', 'hidden', value.attachment_id);
    const preview = document.createElement('img'); preview.alt = 'รูปสีสินค้า'; preview.hidden = !value.image_url;
    if (value.image_url) preview.src = value.image_url;
    row.append(preview);
    const choose = document.createElement('button'); choose.type = 'button'; choose.className = 'button'; choose.textContent = 'เลือกรูป';
    choose.onclick = () => {
      const media = wp.media({title:'เลือกรูปสีสินค้า', library:{type:'image'}, multiple:false});
      media.on('select', () => { const selected = media.state().get('selection').first().toJSON(); attachment.value = selected.id; preview.src = selected.url; preview.hidden = false; });
      media.open();
    };
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'button-link-delete'; remove.textContent = 'ลบสีนี้';
    remove.onclick = () => { row.remove(); document.getElementById('innovative-add-colour').focus(); };
    row.append(choose, remove); root.append(row);
    return row;
  }
  try { const data = JSON.parse(document.getElementById('innovative-colours-data').textContent); if (Array.isArray(data)) data.forEach(addRow); } catch { /* Empty on invalid data. */ }
  document.getElementById('innovative-add-colour').onclick = () => addRow().querySelector('input[type="text"]').focus();
})();
