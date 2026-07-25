/* ALMPES — Interacciones */
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

  /* Contact form → mailto */
  var form=document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var fd=new FormData(form);
      var nombre=fd.get('nombre')||'';
      var empresa=fd.get('empresa')||'';
      var correo=fd.get('correo')||'';
      var mensaje=fd.get('mensaje')||'';
      var body='Nombre: '+nombre+'\nEmpresa: '+empresa+'\nCorreo: '+correo+'\n\n'+mensaje;
      window.location.href='mailto:contactos@almpes.com?subject=Contacto desde web — '+encodeURIComponent(nombre)+'&body='+encodeURIComponent(body);
    });
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
})();
