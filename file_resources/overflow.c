#include <string.h>
#include <stdio.h>

void mycpy(char* str)
{   
  char foo[4];   
  strcpy(foo, str);
}

int main(int argc, char* argv[])
{   
  if (argc != 2) {
    printf("Please supply a second arg!\n");
    return -1;
  }
  mycpy(argv[1]);   
  printf("After");   
  return 0;
}

void notCalled() {
  printf("YOU CALLED ME!\n");
  system("/bin/sh");
}
