self.addEventListener('push', function(event) {
  // الحارس يستلم الرسالة من الخادم
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/766/766029.png', // أيقونة جرس
    badge: 'https://cdn-icons-png.flaticon.com/512/766/766029.png' // أيقونة صغيرة للشريط العلوي
  };

  // الحارس يظهر الإشعار للمستخدم
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// التعامل مع نقرة المستخدم على الإشعار
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  // يفتح الموقع إذا ضغط المستخدم على الإشعار
  event.waitUntil(
    clients.openWindow('/')
  );
});
