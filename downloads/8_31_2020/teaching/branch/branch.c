#include <stdio.h>

int main(int argc, char *argv[]) 
{
    int value = atoi(argv[1]); 
    
    if(value == 1337) 
    {
        printf("You are leet");
    }
    else
    {
        printf("You are not leet"); 
    }

    return value; 
}
