---
title: "Find Vampire Numbers(4 digit number)"
date: "2017-12-15"
categories: 
  - "anything"
---

```null
/**
* find vampire numbers from 1000 to 9999
*/
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class Programming {
    public static void main(String[] args) throws IOException{
        BufferedWriter bw = new BufferedWriter(new FileWriter("1.txt"));
        for(int num = 1000;num <= 9999;num++){
            boolean is = isVampireNumbers(num);
            if(is) {
                bw.write(num + " : " + is + "\r\n");
                bw.flush();
            }
        }
    }
    /** the judgemental function
    * need to be optimized
    */
    public static boolean isVampireNumbers(int num){
        String str = Integer.toString(num);
        int count = str.length();
        if(count % 2 == 0){
            String[] strArr = str.split("");
            boolean is = false;
            int vnum1 = -1,vnum2 = -1;
            for(int i = 0;i < strArr.length - 1;i++){
                int n1 = Integer.parseInt(strArr[i]);
                for(int j = i + 1;j < strArr.length;j++){
                    int n2 = Integer.parseInt(strArr[j]);
                    int[] m = new int[2];
                    int t = 0;
                    for(int k = 0;k < strArr.length;k++){
                        if(k != i && k != j) {
                            m[t] = k;
                            t++;
                        }
                    }
                    int m1 = Integer.parseInt(strArr[m[0]]);
                    int m2 = Integer.parseInt(strArr[m[1]]);
                    if((n1 == 0 && n2 == 0) || (m1 == 0 && m2 == 0))
                        continue;
                    vnum1 = (n1*10+n2);
                    vnum2 = (m1*10+m2);
                    int mul = vnum1 * vnum2;
                    if(mul == num){
                        is = true;
                        break;
                    }else{
                        vnum1 = (n1*10+n2);
                        vnum2 = (m2*10+m1);
                        mul = vnum1 * vnum2;
                        if(mul == num){
                            is = true;
                            break;
                        }else{
                            vnum1 = (n2*10+n1);
                            vnum2 = (m1*10+m2);
                            mul = vnum1 * vnum2;
                            if(mul == num){
                                is = true;
                                break;
                            }else{
                                vnum1 = (n2*10+n1);
                                vnum2 = (m2*10+m1);
                                mul = vnum1 * vnum2;
                                if(mul == num){
                                    is =true;
                                    break;
                                }
                            }
                        }
                    }
                }
                if(is){
                    System.out.println(vnum1 + "*" + vnum2);
                    return true;
                }
            }
        }
        return false;
    }
}
```
