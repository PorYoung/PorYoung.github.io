---
title: "VSCode配置Fortran环境"
date: "2021-03-22"
categories: 
  - "notes-summary"
tags: 
  - "fortran"
  - "vscode"
---

# VsCode Fortran Settings

## Modern Fortran \[_Miguel Carvajal_\]

Fortran highlight plugin.

## C/C++ for Visual Studio Code \[_Microsoft_\]

C/C++ debug plugin also supports fortran.

Toggle debug and modify the example `launch.json` and `tasks.json` files.

## Makefile Tools \[_Microsoft_, _optional_\]

You can set `make` command in `tasks.json` or use this plugin to compile make project.

```
// vscode settings
{
    "makefile.launchConfigurations": [
        {
            "cwd": "/home/user/project",
            "binaryPath": "/home/user/project/bin/program",
            "binaryArgs": []
        }
    ]
}
```

Here is a example for C/C++ make project.

**Directory tree**

```
- bin
-- main
- src
-- main.cpp
-- module.cpp
-- header.h
- Makefile
```

**Makefile**

```
LINK    = @echo linking $@ && g++
GCC     = @echo compiling $@ && g++
GC      = @echo compiling $@ && gcc
AR      = @echo generating static library $@ && ar crv
FLAGS   = -g -DDEBUG -W -Wall -fPIC
GCCFLAGS =
DEFINES =
HEADER  = -I./
LIBS    =
LINKFLAGS =

BIN_PATH = bin
SRC = $(wildcard src/*.cpp)
INCLUDES = include
TARGET = main
OBJECT = $(SRC:%.cpp=%.o)

.SUFFIXES: .cpp .c
.cpp.o:
    $(GCC) -c $(HEADER) $(FLAGS) $(GCCFLAGS) -fpermissive -o $@ #html#lt;

.c.o:
    $(GC) -c $(HEADER) $(FLAGS) -fpermissive -o $@ #html#lt;

$(TARGET) : $(OBJECT)
    @echo "============开始编译============"
    $(LINK) $(FLAGS) $(LINKFLAGS) -o $@ $^ $(LIBS)
    mv $(TARGET) $(BIN_PATH)
    @echo "============编译结束============"

clean:
    rm -rf $(OBJECT) $(TARGET)
```

## FORTRAN IntelliSense (`Chris Hansen`)

Install [`fortran-language-server`](https://github.com/hansec/fortran-language-server) and create `.fortls` file if you need to modify the default configuration.

```
pip install fortran-language-server
```

An example of `.fortls` to add external source of hdf5 libs.

```
{
    "ext_source_dirs": ["/home/user/hdf5/fortran/src"],
    "debug_log": true
}
```

## fprettify (`Blamsoft`)

[Fortran code formatter](https://github.com/pseewald/fprettify).

```
pip install --upgrade fprettify
```

Integrating with VsCode, modify in your need:

```
// VsCode settings
{
    "fprettify.arguments": "-i 4 --case 1 1 1 2"
}
```
