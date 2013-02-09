// unicode - utf8 互转

//    |  Unicode符号范围       |  UTF-8编码方式  
//  n |  (十六进制)            | (二进制)  
// ---+-----------------------+------------------------------------------------------  
//  1 | 0000 0000 - 0000 007F |                                              0xxxxxxx  
//  2 | 0000 0080 - 0000 07FF |                                     110xxxxx 10xxxxxx  
//  3 | 0000 0800 - 0000 FFFF |                            1110xxxx 10xxxxxx 10xxxxxx  
//  4 | 0001 0000 - 0010 FFFF |                   11110xxx 10xxxxxx 10xxxxxx 10xxxxxx  
//  5 | 0020 0000 - 03FF FFFF |          111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx  
//  6 | 0400 0000 - 7FFF FFFF | 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx  

/**
 * unicode转成utf8
 * @param  {string} char 字符
 * @return {string}      16进制值
 */
function unicodeutf8(char){
	//转成unicode
	var unicode = char.charCodeAt(0);
	var hex;
	//1位UTF8
	if(unicode < 0x80){
		hex = unicode;
	}
	//2位UTF8
	else if(unicode < 0x800){
		//先右移6位过滤第二个byte的值 
		//与 11000000  求或
		//再左移8位到第一个byte
		hex =  ( ( unicode >>> 6 ) | 0xC0 )  << 8;
		//与 00111111 求与
		//与 10000000 求或
		hex += (unicode & 0x3F) | 0x80;
	}
	//3位UTF8
	else if(unicode < 0x10000){
		//先右移12位过滤第二三个byte的值 
		//与 11100000  求或
		//再左移16位到第一个byte
		hex =  ( ( unicode >>> 12 ) | 0xE0 )  << 16;
		//与 00111111  求与
		//与 10000000  求或
		hex += ( (unicode >> 6 & 0x3F) | 0x80 ) << 8;
		hex += (unicode & 0x3F) | 0x80;
	}
	//4位UTF8
	else if(unicode < 0x200000){
		//先右移18位过滤第二三四个byte的值 
		//与 11110000  求或
		//再左移24位到第一个byte
		hex =  ( ( unicode >>> 18 ) | 0xF0 )  << 24;
		//与 00111111  求与
		//与 10000000  求或
		hex += ( (unicode >> 12 & 0x3F) | 0x80 ) << 16;
		hex += ( (unicode >> 6 & 0x3F) | 0x80 ) << 8;
		hex += (unicode & 0x3F) | 0x80;
	}
	//5位UTF8
	else if(unicode < 0x4000000){
		//先右移18位过滤第二三四个byte的值 
		//与 11111000  求或
		//再左移24位到第一个byte
		hex =  ( ( unicode >>> 24 ) | 0xF8 )  << 32;
		//与 00111111  求与
		//与 10000000  求或
		hex += ( (unicode >> 18 & 0x3F) | 0x80 ) << 24;
		hex += ( (unicode >> 12 & 0x3F) | 0x80 ) << 16;
		hex += ( (unicode >> 6 & 0x3F) | 0x80 ) << 8;
		hex += (unicode & 0x3F) | 0x80;
	}
	//6位UTF8
	else if(unicode < 0x7FFFFFFF){
		//先右移18位过滤第二三四个byte的值 
		//与 11111100  求或
		//再左移24位到第一个byte
		hex =  ( ( unicode >>> 30 ) | 0xFC )  << 40;
		//与 00111111  求与
		//与 10000000  求或
		hex += ( (unicode >> 24 & 0x3F) | 0x80 ) << 32;
		hex += ( (unicode >> 18 & 0x3F) | 0x80 ) << 24;
		hex += ( (unicode >> 12 & 0x3F) | 0x80 ) << 16;
		hex += ( (unicode >> 6 & 0x3F) | 0x80 ) << 8;
		hex += (unicode & 0x3F) | 0x80;
	}

	return hex.toString(16);
}

/**
 * 将utf8值转成unicode字符
 * @param  {string} char 16进制值
 * @return {string}	unicode字符
 */
function utf8unicode(hex){
	var unicode;
	//1位UTF8
	//0xxxxxxx
	if(hex <= 0x7F){
		unicode = hex;
	}
	//2位UTF8
	//110xxxxx 10xxxxxx
	else if(hex >=  0xC080 && hex <= 0xDFBF){
		//先右移8位过滤第二个byte的值 
		//与 11111  求且
		//再左移6位到第一个byte
		unicode =  ( ( hex >>> 8 ) & 0x1F )  << 6;
		unicode += hex & 0x3F;
	}
	//3位UTF8
	else if(hex >= 0xE08080 && hex <= 0xEFBFBF){
		unicode =  ( ( hex >>> 16 ) & 0xF )  << 12;
		unicode += (hex >> 8 & 0x3F)  << 6;
		unicode += hex & 0x3F;
	}
	//4位UTF8
	else if(hex >= 0xF0808080 && hex <= 0xF7BFBFBF){
		unicode =  ( ( hex >>> 24 ) & 0x7 )  << 18;
		unicode += (hex >> 16 & 0x3F) << 12;
		unicode += (hex >> 8 & 0x3F) << 6;
		unicode += hex & 0x3F;
	}
	//5位UTF8
	else if(hex >= 0xF880808080 && hex <= 0xFBBFBFBFBF){
		unicode =  ( ( hex >>> 32 ) & 0x3 )  << 24;
		unicode += (hex >> 24 & 0x3F) << 18;
		unicode += (hex >> 16 & 0x3F) << 12;
		unicode += (hex >> 8 & 0x3F) << 6;
		unicode += hex & 0x3F;
	}
	//6位UTF8
	else if(hex >= 0xFC8080808080 && hex <= 0xFDBFBFBFBFBF){
		unicode =  ( ( hex >>> 40 ) & 0x1 )  << 30;
		unicode += (hex >> 32 & 0x3F) << 24;
		unicode += (hex >> 24 & 0x3F) << 18;
		unicode += (hex >> 16 & 0x3F) << 12;
		unicode += (hex >> 8 & 0x3F) << 6;
		unicode += hex & 0x3F;
	}
	return String.fromCharCode(unicode);
}