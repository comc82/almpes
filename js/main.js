/* ALMPES — Interacciones + Seguridad de formularios */
(function(){
  /* Year */
  var y=document.getElementById('year');
  if(y) y.textContent=new Date().getFullYear();

  /* Mobile nav toggle */
  var toggle=document.querySelector('.nav-toggle');
  var nav=document.querySelector('.nav-main');
  if(toggle&&nav){
    toggle.addEventListener('click',function(){
      nav.classList.toggle('open');
      var expanded=toggle.getAttribute('aria-expanded')==='true';
      toggle.setAttribute('aria-expanded',String(!expanded));
    });
  }

  /* Sub-menu toggle on mobile */
  document.querySelectorAll('.has-sub > a').forEach(function(link){
    link.addEventListener('click',function(e){
      if(window.innerWidth<=768){
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  /* Close mobile nav on resize */
  window.addEventListener('resize',function(){
    if(window.innerWidth>768&&nav) nav.classList.remove('open');
  });

  /* Scroll reveal */
  var reveals=document.querySelectorAll('.reveal');
  if(reveals.length){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    reveals.forEach(function(el){ io.observe(el); });
  }

  /* Smooth anchor offset for sticky header */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var id=a.getAttribute('href');
      if(id&&id.length>1){
        var target=document.querySelector(id);
        if(target){
          e.preventDefault();
          var top=target.getBoundingClientRect().top+window.pageYOffset-90;
          window.scrollTo({top:top,behavior:'smooth'});
        }
      }
    });
  });

  /* ═══════════════════════════════════════
     FORMULARIOS — Seguridad y validación
     ═══════════════════════════════════════ */

  /* Timestamp anti-bot: formulario cargado en t0 */
  var loadTime=Date.now();
  document.querySelectorAll('.form-ts').forEach(function(el){
    el.value=String(loadTime);
  });

  /* Sanitización: strip HTML, limitar caracteres peligrosos */
  function sanitize(str){
    if(typeof str!=='string') return'';
    return str
      .replace(/<[^>]*>/g,'')
      .replace(/["'`;\\]/g,'')
      .replace(/javascript:/gi,'')
      .replace(/on\w+\s*=/gi,'')
      .replace(/\{[\s\S]*\}/g,'')
      .trim();
  }

  /* Validación de email */
  function isValidEmail(e){
    return/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
  }

  /* Validación de teléfono (peruano: 7-15 dígitos, espacios, guiones, +) */
  function isValidPhone(p){
    if(!p) return true; /* opcional */
    return/^[\d\s\-\+]{7,15}$/.test(p);
  }

  /* Validación de archivo adjunto */
  var allowedTypes=['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  var allowedExts=['.pdf','.doc','.docx'];
  var maxSize=5*1024*1024; /* 5 MB */

  function isValidFile(input){
    if(!input.files||!input.files.length) return{valid:true};
    var file=input.files[0];
    if(file.size>maxSize) return{valid:false,msg:'El archivo pesa más de 5 MB. Comprimilo o elegí uno más liviano.'};
    var ext='.'+file.name.split('.').pop().toLowerCase();
    if(allowedExts.indexOf(ext)===-1) return{valid:false,msg:'Este formato no se acepta. Subí tu CV en PDF, DOC o DOCX.'};
    if(allowedTypes.indexOf(file.type)===-1) return{valid:false,msg:'El tipo de archivo no es válido. Solo se permiten PDF, DOC y DOCX.'};
    return{valid:true};
  }

  /* Mostrar error en campo */
  function showError(field,msg){
    var container=field.closest('.field');
    container.classList.add('field--error');
    var msgEl=container.querySelector('.field-msg');
    if(msgEl) msgEl.textContent=msg;
  }

  /* Limpiar error de campo */
  function clearError(field){
    var container=field.closest('.field');
    if(!container) return;
    container.classList.remove('field--error');
    var msgEl=container.querySelector('.field-msg');
    if(msgEl) msgEl.textContent='';
  }

  /* Limpiar error de select */
  function clearSelectError(select){
    clearError(select);
  }

  /* Mensaje general de error */
  function setFormError(form,msg){
    var el=form.querySelector('.form-error');
    if(el) el.textContent=msg;
  }

  function clearFormError(form){
    var el=form.querySelector('.form-error');
    if(el) el.textContent='';
  }

  /* Rate limit: mínimo 3 segundos entre envíos */
  var lastSubmit={};

  /* Validar y enviar formulario */
  function setupForm(formId,validators){
    var form=document.getElementById(formId);
    if(!form) return;

    /* Limpiar errores al escribir */
    form.querySelectorAll('input,textarea,select').forEach(function(el){
      el.addEventListener('input',function(){ clearError(el); });
      el.addEventListener('change',function(){ clearSelectError(el); });
    });

    form.addEventListener('submit',function(e){
      e.preventDefault();
      clearFormError(form);

      /* Rate limit */
      var now=Date.now();
      if(lastSubmit[formId]&&(now-lastSubmit[formId]<3000)){
        setFormError(form,'Esperá un momento antes de enviar otra vez.');
        return;
      }

      /* Honeypot check */
      var hp=form.querySelector('[name="_formsubmit_honeypot"]');
      if(hp&&hp.value){
        /* Bot detectado — simular éxito sin enviar */
        setFormError(form,'');
        form.innerHTML='<p style="text-align:center;color:var(--accent);font-weight:600;">¡Gracias! Tu mensaje ha sido enviado.</p>';
        return;
      }

      /* Timestamp check: si se envió en menos de 2 segundos, es bot */
      var ts=form.querySelector('.form-ts');
      if(ts&&ts.value){
        var elapsed=now-parseInt(ts.value,10);
        if(elapsed<2000){
          setFormError(form,'Por favor completá el formulario antes de enviar.');
          return;
        }
      }

      /* Validaciones por campo */
      var valid=true;
      validators(form,{
        set:function(field,msg){ showError(field,msg); valid=false; },
        clear:clearError
      });

      if(!valid){
        setFormError(form,'Revisá los campos que están marcados en rojo.');
        return;
      }

      /* Sanitizar todos los campos de texto antes de enviar */
      form.querySelectorAll('input[type="text"],textarea').forEach(function(el){
        if(!el.name.startsWith('_')) el.value=sanitize(el.value);
      });

      /* Validar archivo adjunto si existe */
      var fileInput=form.querySelector('input[type="file"]');
      if(fileInput&&fileInput.files&&fileInput.files.length){
        var fileCheck=isValidFile(fileInput);
        if(!fileCheck.valid){
          showError(fileInput,fileCheck.msg);
          setFormError(form,'Revisá los campos marcados.');
          return;
        }
      }

      /* Deshabilitar botón para evitar doble envío */
      var btn=form.querySelector('button[type="submit"]');
      if(btn){
        btn.disabled=true;
        btn.textContent='Enviando...';
      }

      /* Rate limit timestamp */
      lastSubmit[formId]=Date.now();

      /* Enviar vía AJAX para controlar la respuesta */
      var fd=new FormData(form);
      var xhr=new XMLHttpRequest();
      xhr.open('POST',form.action,true);
      xhr.onload=function(){
        if(xhr.status>=200&&xhr.status<400){
          form.innerHTML='<p style="text-align:center;color:var(--accent);font-weight:600;">¡Gracias! Tu mensaje ha sido enviado. Te responderemos pronto.</p>';
        } else {
          setFormError(form,'No se pudo enviar. Verificá tu conexión y intentá de nuevo.');
          if(btn){
            btn.disabled=false;
            btn.textContent=btn.dataset.original||'Enviar';
          }
        }
      };
      xhr.onerror=function(){
        setFormError(form,'No tenés conexión a internet. Revisá tu red y volvé a intentar.');
        if(btn){
          btn.disabled=false;
          btn.textContent=btn.dataset.original||'Enviar';
        }
      };
      xhr.send(fd);
    });
  }

  /* Guardar texto original del botón */
  document.querySelectorAll('button[type="submit"]').forEach(function(btn){
    btn.dataset.original=btn.textContent;
  });

  /* ── Formulario de Contacto ── */
  setupForm('contact-form',function(form,v){
    var nombre=form.querySelector('#nombre');
    if(nombre&&nombre.value.trim().length===0){
      v.set(nombre,'¿Cómo te llamás? Ingresá tu nombre.');
    } else if(nombre&&nombre.value.trim().length<2){
      v.set(nombre,'El nombre debe tener al menos 2 caracteres.');
    }

    var empresa=form.querySelector('#empresa');
    if(empresa&&empresa.value.trim().length>100){
      v.set(empresa,'El nombre de la empresa es demasiado largo (máx. 100).');
    }

    var correo=form.querySelector('#correo');
    if(correo&&correo.value.trim().length===0){
      v.set(correo,'Necesitamos tu correo para responderte.');
    } else if(correo&&!isValidEmail(correo.value)){
      v.set(correo,'El correo no parece válido. Revisalo y volvé a intentar.');
    }

    var servicio=form.querySelector('#servicio');
    if(servicio&&!servicio.value){
      showError(servicio,'¿Qué servicio te interesa? Elegí una opción.');
    }

    var mensaje=form.querySelector('#mensaje');
    if(mensaje&&mensaje.value.trim().length===0){
      v.set(mensaje,'Contanos qué necesitás, así te podemos ayudar.');
    } else if(mensaje&&mensaje.value.trim().length<10){
      v.set(mensaje,'El mensaje es muy corto. Contanos un poco más (mín. 10 caracteres).');
    } else if(mensaje&&mensaje.value.trim().length>2000){
      v.set(mensaje,'El mensaje es muy largo. Intentá resumirlo (máx. 2000 caracteres).');
    }
  });

  /* ── Formulario de Postulación ── */
  setupForm('jobs-form',function(form,v){
    var nombre=form.querySelector('#nombre');
    if(nombre&&nombre.value.trim().length===0){
      v.set(nombre,'¿Cómo te llamás? Escribí tu nombre completo.');
    } else if(nombre&&nombre.value.trim().length<2){
      v.set(nombre,'El nombre debe tener al menos 2 caracteres.');
    }

    var telefono=form.querySelector('#telefono');
    if(telefono&&telefono.value.trim().length>0&&!isValidPhone(telefono.value)){
      v.set(telefono,'El formato del teléfono no es válido. Usá solo números, espacios o guiones.');
    }

    var correo=form.querySelector('#correo');
    if(correo&&correo.value.trim().length===0){
      v.set(correo,'Necesitamos tu correo para contactarte.');
    } else if(correo&&!isValidEmail(correo.value)){
      v.set(correo,'El correo no parece válido. Revisalo y volvé a intentar.');
    }

    var area=form.querySelector('#area');
    if(area&&!area.value){
      showError(area,'¿Qué área te interesa? Elegí una opción.');
    }

    var cvFile=form.querySelector('#cv-file');
    if(cvFile&&cvFile.files&&cvFile.files.length){
      var fileResult=isValidFile(cvFile);
      if(!fileResult.valid){
        v.set(cvFile,fileResult.msg);
      }
    }
  });

  /* ── Contador Numérico Animado (Stats Counter) ── */
  var counterEls = document.querySelectorAll('.counter-value');
  if (counterEls.length) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          var countTo = parseInt(target.getAttribute('data-target'), 10);
          var prefix = target.getAttribute('data-prefix') || '';
          var suffix = target.getAttribute('data-suffix') || '';
          var duration = 1800;
          var stepTime = 30;
          var steps = duration / stepTime;
          var increment = countTo / steps;
          var current = 0;
          var timer = setInterval(function() {
            current += increment;
            if (current >= countTo) {
              current = countTo;
              clearInterval(timer);
            }
            target.textContent = prefix + Math.floor(current).toLocaleString('es-PE') + suffix;
          }, stepTime);
          counterObserver.unobserve(target);
        }
      });
    }, { threshold: 0.4 });
    counterEls.forEach(function(el) { counterObserver.observe(el); });
  }

  /* ── Filtrado de Pestañas de Servicios ── */
  var serviceTabs = document.querySelectorAll('.svc-tab-btn');
  var serviceCards = document.querySelectorAll('.service-card-item');
  if (serviceTabs.length && serviceCards.length) {
    serviceTabs.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var category = btn.getAttribute('data-filter');
        serviceTabs.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        serviceCards.forEach(function(card) {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = '';
            card.style.opacity = '';
            card.style.transform = '';
            card.classList.add('visible');
          } else {
            card.classList.remove('visible');
            card.style.display = 'none';
            card.style.opacity = '';
            card.style.transform = '';
          }
        });
      });
    });
  }
})();

