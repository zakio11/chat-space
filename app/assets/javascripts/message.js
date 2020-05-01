$(function(){
  function buildHTML(message){
    if ( message.image) {
      var html =
        `<div class = "chat-main__message__list" data-message-id=${message.id} >
          <div class = "chat-main__message__list__info" >
            <div class = "chat-main__message__list__info__talker">
              ${message.user_name}
            </div>
            <div class="chat-main__message__list__info__date">
              ${message.created_at}
            </div>
          </div>
          <div class="chat-main__message__list__info__text">
            ${message.content}
          </div>
          <img src=${message.image} >
        </div>`
      return html;
    } else {
      var html =
        `<div class = "chat-main__message__list" data-message-id=${message.id}>
          <div class = "chat-main__message__list__info" >
          <div class = "chat-main__message__list__info__talker">
            ${message.user_name}
          </div>
          <div class="chat-main__message__list__info__date">
            ${message.created_at}
          </div>
        </div>
        <div class="chat-main__message__list__info__text">
          ${message.content}
        </div>`
      return html;
    };
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false 
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.chat-main__message').append(html);
      $('.chat-main__message').animate({ scrollTop: $('.chat-main__message')[0].scrollHeight});
      $('form')[0].reset();
      $('.submit-btn').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    });
  });
  var reloadMessages = function() {
    var last_message_id = $('.chat-main__message__list:last').data("message-id");
    console.log(last_message_id);
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.chat-main__message').append(insertHTML);
        $('.chat-main__message').animate({ scrollTop: $('.chat-main__message')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
     setInterval(reloadMessages, 7000);
  }
});