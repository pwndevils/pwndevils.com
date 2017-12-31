
/*
 *   StackOverrun.c
 *     This program shows an example of how a stack-based 
 *       buffer overrun can be used to execute arbitrary code.  Its 
 * objective is to find an input string that executes the function bar.
 * */

#pragma check_stack(off)

#include <string.h>
#include <stdio.h> 

void foo(const char* input)
{
    char buf[10];
    printf("My stack looks like:\n%p\n%p\n%p\n%p\n%p\n% p\n\n");

    strcpy(buf, input);
    printf("%s\n", buf);

    printf("Now the stack looks like:\n%p\n%p\n%p\n%p\n%p\n%p\n\n");
}

void bar(void)
{
    printf("Augh! I've been hacked!\n");

}

int main(int argc, char* argv[])
{
//Blatant cheating to make life easier on myself
    printf("Address of foo = %p\n", foo);
    printf("Address of bar = %p\n", bar);
    if (argc != 2) 
    {
        printf("Please supply a string as an argument!\n");
        return -1;
    } 
    foo(argv[1]);
    return 0;
}
