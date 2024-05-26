<style>
</style>

<script>

function onSubmit() {
  let uploadForm = document.getElementById('upload-form');
  let prg = document.getElementById('prg');
  prg.style.backgroundColor = 'blue';
  var data = new FormData(uploadForm);
  var req = new XMLHttpRequest();
  var fsize = document.getElementById('file').files[0].size;
  req.open('POST', '/update?size=' + fsize);
  req.upload.addEventListener('progress', p => {
    console.log("progress " + p.loaded + " " + p.total);
    let w = Math.round(p.loaded/p.total*100) + '%';
    if (p.lengthComputable) {
      prg.innerHTML = w;
      prg.style.width = w;
    }
    if (w == '100%') prg.style.backgroundColor = 'black';
  });
  req.send(data);
}
</script>

<div class="container-upgrade">
  <h3>Оновлення</h3>
  <form method='POST' enctype='multipart/form-data' id='upload-form' on:submit|preventDefault={onSubmit}>
    <input type='file' id='file' name='update' accept='.esp32.bin'/>
    <input type='submit' value='Завантажити'/>
  </form>
  <br/>
  <div id='prg' style='width:0;color:white;text-align:center'>0%</div>
</div>
