var io = null;
    var toUser = 'all';

    function enter(){

        var name=$('#name').val();
        if(name==''){
            alert('�ǳƲ���Ϊ��');
            return false;
        }

        var user = {
            name:name,
            pwd:'123'
        }

        io = new SocketIO('127.0.0.1',8000);
        io.on('connect',function(){
            console.log('open');

            io.emit('login', user, function(ok){
                if(ok){
                    $('#chat').show();
                    $('#enter').hide();
                }else{
                    $('#content').append('<p class="msg_tip">����ʧ�ܣ�<p>');
                }
            });

            io.on('user', function(users){
                var usersDiv = $('#users');
                usersDiv.html($("<a href=\"javascript:;\" onclick=\"selectUser('all',this)\" class=\"user_select\">������</a>"));
                for(var i in users){
                    usersDiv.append($('<a href="javascript:;" onclick="selectUser(\''+i+'\',this)">'+users[i]+'</a>'));
                }
            });

            io.on('msg', function(msg){
                $('#content').append($('<p  class="msg_recv">'+msg.name+ ":" + msg.content +'</p>'));
                console.log(msg);
            });

            io.on('notice', function(msg){
                $('#content').append($('<p  class="msg_recv">ϵͳ���棺'+ msg +'</p>'));
                console.log(msg);
            });

            io.on('close', function(){
                ('#content').append($('<p class="msg_recv">�� ��</p>'));
            });
        });

    }

    function send(){
        var content = $('#msg').val();
        var data ={
            to:toUser,
            content:content
        }
        io.emit('msg',data,function(ok){
            if(ok) ('#content').append($('<p class="msg_recv">��˵��' + content + '</p>'));
        })
    }

    function selectUser(select,obj){
        toUser=select;
        $('.user_select').removeClass('user_select');
        $(obj).addClass('user_select');
    }

    function exit(){
        io.close();
//        io.emit('exit', JSON.stringify(user),function(msg){
//            console.log(msg);
//        });
        $('#enter').show();
        $('#chat').hide();
    }