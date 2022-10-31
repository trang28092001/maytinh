$(function(){

    var expressionArray = [];
    var screenArray = [];
    var parentheses = 0;
    var error = false;
    var onScreen = false;
    var equal = null;

    function defaults(){
        expressionArray = [];
        screenArray = [];
        parentheses = 0;
        error = false;
        onScreen = false;
        equal = null;
        $('.result').html('');
        $('.screen').html('');
        $('.hint').html('');
    }

    function adjustParentheses(num){
        $('.hint').html(')'.repeat(num));
    }

    function writeToScreen(mode, text){
        if (mode == 'append'){
            if (error) {
                screenArray = [];
            }
            error = false;
            screenArray.push(text);
        }
        else if (mode == 'write'){
            screenArray = [text];
        }
        else if (mode == 'delete'){
            var popped = screenArray.pop();
            if (/[(]$/g.test(popped)){
                parentheses > 0 ? parentheses-- : parentheses = 0;
                adjustParentheses(parentheses);
            }
        }

        $('.screen').html(screenArray.join(''));
    }

    function float2int(value) {
        return Math.floor(value);
    }

    function addToExpression(text) {
        if (equal && Number.isInteger(parseFloat(equal))) {
          if (expressionArray.length === 1) {
            expressionArray = [float2int(expressionArray).toString()];
          }
          expressionArray.push(text);
        } else if (equal && !Number.isInteger(parseFloat(equal))) {
          if (expressionArray.length === 1) {
            expressionArray = [parseFloat(expressionArray).toString()];
          }
          expressionArray.push(text);
        } else {
          expressionArray.push(text);
        }
      }

    function removeFromExpression(){
        var count = expressionArray.pop();
    }

    //kết quả
    $('.en').click(
        function() {
            if (onScreen) {
                expressionArray = [equal];
            }
            addToExpression(')'.repeat(parentheses));
            try{
                $('.result').html($('.screen').html() + ')'.repeat(parentheses) + ' =');
                equal = math.eval(expressionArray.join('')).toPrecision(15);
                writeToScreen('write', equal.toString().replace(/(\.0+$)|(0+$)/g, ''));
                $('.hint').html('');

                onScreen = true;
            } catch(e){
                defaults();
                error = true ;
                writeToScreen ('write','Syntax Error');
            }

            parentheses = 0;
            expressionArray = [];
        } 
    );
    // xóa hết
    $('.clear').click(
        function(){
            defaults();
        }
    );

    // xoá từng phần tử
    $('.back').click(
        function(){
            if (expressionArray.length) {
                removeFromExpression();
                writeToScreen('delete', '');
            }
        }
    );

    //  so vao man
    // toan tu
    $('.op').click(
        function(){
            var key = $(this).attr('key');
            var char = $(this).html();
            operator(key,char);
        }
    );

    //dau ngoac
    $('.par').click(
        function(){
            var key = $(this).attr('key');
            var char = $(this).html();
            operator(key,char);

            if (key == '(') {
                parentheses++;
                adjustParentheses(parentheses);
            }  else if (key == ")") {
                parentheses > 0 ? parentheses-- : parentheses = 0;
                adjustParentheses(parentheses);
            }
        }
    );

    // chức năng
    $('.fun').click(
        function(){
            var key = $(this).attr('key');
            var char = $(this).html() + '(';
            operator(key,char);
            
            parentheses++;
            adjustParentheses(parentheses);
        }
    );

    function operator(key, char){
            if (onScreen) {
                $('.result').html($('.screen').html());
                writeToScreen('write', $('.screen').html());
                expressionArray = [equal];
                parentheses = 0;
                $('.hint').html('');
                onScreen = false;
             }
            addToExpression(key);
            writeToScreen('append',char);
    }
});