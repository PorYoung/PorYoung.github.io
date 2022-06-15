---
title: "AiiDA及aiida-quantumespresso基本介绍及使用"
date: "2021-04-18"
categories: 
  - "notes"
tags: 
  - "aiida"
  - "materials-science"
---

**作者：PorYoung** **[原始文档：](https://static.poryoung.cn/aiida/)[https://static.poryoung.cn/aiida/](https://static.poryoung.cn/aiida/)** **发布时间：2020年10月**

# Basic Tutorial and Simple Examples for Aiida

## Official Websites

- [Aiida](http://www.aiida.net/)
- [Miniconda](https://docs.conda.io/en/latest/miniconda.html)
- [aiida-quantumespresso docs](https://aiida-quantumespresso.readthedocs.io/en/latest/)

## Aiida installation

### MiniConda Installation

1. Download Miniconda Miniconda installation pakage [https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/](https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/)
2. Install conda
    
    ```
    # the `xxx` is version code
    bash ./Miniconda-[xxx].sh
    ```
    
3. Reboot shell

### Conda usage

- 配置清华（其他）源
    
    ```
    conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
      conda config --set show_channel_urls yes
    ```
    
- 创建虚拟环境
    
    ```
    conda create -n [env_name] python=[python version]
    ```
    
- 激活/进入虚拟环境
    
    ```
    conda activate [env_name]
    ```
    
- 退出虚拟环境
    
    ```
    conda deactivate
    ```
    

### Install Aiida

1. Use conda to install Aiida(**Optional**)（[见aiida文档](https://aiida.readthedocs.io/projects/aiida-core/en/latest/intro/installation.html#conda)）
    
    ```
    conda create -n aiida -c conda-forge python=3.7 aiida-core aiida-core.services pip
    conda activate aiida
    conda deactivate
    ```
    
2. Use conda to create Python vitrual env，and use `pip`to install aiida(**Optional**)
    
    ```
    # for example
    conda create -n aiida python=3.8
    conda activate aiida
    pip install aiida-core
    ```
    
3. Prerequisites Installation
    
    ```
    # you may try `apt update` in advance
    # if generate `update error message`, try change a open source mirror
    sudo apt-get install postgresql postgresql-server-dev-all postgresql-client
    sudo apt-get install rabbitmq-server
    sudo rabbitmqctl status
    ```
    
4. Setting up the installation
    
    ```
    # For maximum customizability, one can use verdi setup
    verdi quicksetup
    ```
    
    success info like this
    
    ```
    Success: created new profile `a`.
    Info: migrating the database.
    Operations to perform:
    Apply all migrations: auth, contenttypes, db
    Running migrations:
    Applying contenttypes.0001_initial... OK
    Applying contenttypes.0002_remove_content_type_name... OK
    ...
    Applying db.0044_dbgroup_type_string... OK
    Success: database migration completed.
    ```
    

### Steps from Getting start page`#Start Computation Services`

- `rabbitmq-server -detached`
    
    ```
    DIAGNOSTICS
      ===========
    
      nodes in question: [rabbit@ubuntu01]
    
      hosts, their running nodes and ports:
      - ubuntu01: [{rabbit,39056},{rabbitmqprelaunch2034,39422}]
    
      current node details:
      - node name: rabbitmqprelaunch2034@ubuntu01
      - home dir: /var/lib/rabbitmq
      - cookie hash: gHkRo5BrsxP/v89EnRf5/w==
    ```
    
- `verdi daemon start 2`
    
    ```
    Starting the daemon... RUNNING
    ```
    
- `verdi check`
    
    ```
      ✔ config dir:  /home/majinlong/.aiida
      ✔ profile:     On profile a
      ✔ repository:  /home/majinlong/.aiida/repository/a
      ✔ postgres:    Connected as aiida_qs_majinlong_7b54632a71306c771d8043bd779c519c@localhost:5432
      ✔ rabbitmq:    Connected to amqp://127.0.0.1?heartbeat=600
      ✔ daemon:      Daemon is running as PID 2202 since 2020-09-22 11:42:05
    ```
    
- install graphviz
    
    > [officical website](https://graphviz.org/download/)
    
    ```
    # for ubuntu
    sudo apt install graphviz
    ```
    

### Have a quick look at Basic Tutorial

1. setup computer
    
    ```
     verdi computer setup
     # or setup with .yml file
     verdi computer setup --config computer.yml
    ```
    
    `computer.yml`:
    
    \`\`\`yml

````
---
label: "localhost"
hostname: "localhost"
transport: local
scheduler: "direct"
work_dir: "/home/max/.aiida_run"
mpirun_command: "mpirun -np {tot_num_mpiprocs}"
mpiprocs_per_machine: "2"
prepend_text: |
module load mymodule
export NEWVAR=1
```
````

1. setup code
    
    ```
     verdi code setup
     # or setup with .yml file
     verdi code setup --config code.yml
    ```
    
    `code.yml`:
    
    \`\`\`yml

````
---
label: "qe-6.3-pw"
description: "quantum_espresso v6.3"
input_plugin: "quantumespresso.pw"
on_computer: true
remote_abs_path: "/path/to/code/pw.x"
computer: "localhost"
prepend_text: |
module load module1
module load module2
append_text: " "
```
````

1. how to check plugin
    
    ```
     verdi plugin list
     #or
     verdi plugin list [spec]
    ```
    
2. how to list process
    
    ```
     verdi process list -a
    ```
    
    > [Aiida Basic Turtorial](https://aiida.readthedocs.io/projects/aiida-core/en/latest/intro/tutorial.html)
    

## Quantumespresso Installation

### Setup of Intel Compiler

1. Download `Intel® Parallel Studio XE` and follow the guide to install.
2. set environment variables in `~/.bashrc` (_default path is `/opt/intel`_)
    
    ```
     # intel and mkl
     source /opt/intel/bin/compilervars.sh intel64
     source /opt/intel/mkl/bin/mklvars.sh intel64
     export MKL_LIB_PATH=/opt/intel/mkl/lib/intel64
     export PATH=/opt/intel/bin:$PATH
     # mpi and others
     source /opt/intel/impi/2018.4.274/bin64/mpivars.sh intel64
     export MPI_HOME=/opt/intel/compilers_and_libraries_2018.5.274/linux/mpi
     export PATH=$MPI_HOME/bin:$PATH
     export LD_LIBRARY_PATH=$MPI_HOME/lib:$LD_LIBRARY_PATH
    ```
    
3. source or relogin to take effect

### Setup of QE

1. login `root` user :question:_Other users are sopposed to install qe, but somehow it can not find MKL lib when use `sudo ./configure`_
2. Download QE release version
3. use `./configure` to check environment
4. then configure to install
    
    ```
     ./configure --prefix= CC=mpiicc CXX=icpc F77=ifort F90=ifort FC=ifort MPIF90=mpiifort
    ```
    
5. if satisfied with your expectaion then `make` and `make install`.

## aiida-quantumespresso plugin

### **IMPORTANT**

Please check version of aiida-core is 1.4.0 or higher.

install aiida-quantumespresso plugin from github

```
git clone https://github.com/aiidateam/aiida-quantumespresso
pip install aiida-quantumespresso
```

### setup of a computer and other settings

1. Setup of a computer named `TheHive` and all the later calculation will implement on it
    
    ```
     # -L [computer name] -w [work directory]
     verdi computer setup -L TheHive -H localhost -T local -S direct -w `echo $PWD/work` -n
     verdi computer configure local TheHive --safe-interval 5 -n
    ```
    
2. How to check codes,computers and plugins in aiida
    
    ```
     # check aiida plugin/computer/code list
     # such as `verdi plugin list aiida.calculation`
     verdi code list
     verdi computer list
     verdi plugin list
    ```
    
3. Pseudopotential families Before you run a calculation, you need to upload or define the pseudopotential
    
    ```
     # upload
     verdi data upf uploadfamily [path/to/folder] [name_of_the_family] "some description for your convenience"
     # check list
     verdi data upf listfamilies
    ```
    
    > [see what is and how to create pseudopotential families in official docs](https://aiida-tutorials.readthedocs.io/en/latest/pages/2019_ISSP_Chiba_Japan/sections/appendix_upf_data.html#introduction-pseudopotential-families)
    

### Run pw example

> The plugin requires at least the presence of:

```
An input structure;
A k-points mesh, in the form of a KpointsData object;
Pseudopotential files for the atomic species present;
A parameters dictionary, that contains the details of the Quantum ESPRESSO calculation;
Other inputs are optional, for example:

metadata is a dictionary of inputs that modify slightly the behaviour of a processes;
settings is a Dict dictionary that provides access to more advanced, non-default feature of the code.
```

1. setup code `quantumespresso.pw` `pw_code.yml`:
    
    \`\`\`yml

* * *

label: "pwt" description: "quantum\_espresso pw test" input\_plugin: "quantumespresso.pw" on\_computer: true remote\_abs\_path: "/home/majinlong/qe\_release\_6.4/bin/pw.x" computer: "TheHive"

```

  ```bash
  verdi code setup --config pw_code.yml
```

1. Copy example code here provided \[^1\] or
    
    download the official example(**watch out**) \[^2\] file to test
    - run with verdi
        
        ```
          verdi run example
        ```
        
    - run with python
        
        ```
          python example.py
        ```
        
    - run in verdi shell
        
        ```
          verdi shell
          > import example
        ```
        
        > check the [documentation here](https://aiida-quantumespresso.readthedocs.io/en/latest/user_guide/get_started/examples/pw_tutorial.html#structure) to understand mappings from input files to python dict and how to define your inputs.
        
2. Retrieve results
    - run with `run`
        1. get the CalcJobNode PK
            
            ```
            verdi process list -a
            ```
            
        2. verdi shell
            
            ```
            from aiida.orm import load_node
            calc = load_node(PK)
            ```
            
        3. results in `calc.res`
    - run with `submit`
        
        ```
        calc = submit(CalcJob)
        calc.res
        ```
        

### Run ph example

1. setup code `quantumespresso.ph` as same with `pw` `ph_code.yml`:
    
    \`\`\`yml

````
---
label: "pht"
description: "quantum_espresso ph test"
input_plugin: "quantumespresso.ph"
on_computer: true
remote_abs_path: "/home/majinlong/qe_release_6.4/bin/ph.x"
computer: "TheHive"
```

```bash
verdi code setup --config ph_code.yml
```
````

1. use example code here \[^3\] not official code(if no update version)
2. run code
    
    ```
     verdi run ph_example.py
    ```
    
3. the same way to retrieve result

### Run nscf example

1. run example code here \[^4\]
2. the same way to retrieve result

### Run bands example

Almost the same with nscf example code, just change `nscf` in `updated_parameters['CONTROL']['calculation'] = 'nscf'` to `bands` \[^5\]

```
# generate output_bands graph
result.outputs.export(path='bands.pdf',fileformat='mpl_pdf')
```

### Run q2r example

1. setup `q2r.x` code here is the `q2r.yml`:
    
    \`\`\`yml

````
---
label: "q2rt"
description: "quantum_espresso q2r test"
input_plugin: "quantumespresso.q2r"
on_computer: true
remote_abs_path: "/home/majinlong/qe_release_6.4/bin/q2r.x"
computer: "TheHive"
```
````

1. run example code here \[^6\](like _ph_ calc, you need to load _ph_ calc node)
    
    > Notice the output: `SinglefileData` A file containing the force constants in real space(_in work dir named `real_space_force_constants.dat`_)
    

### About Seekpath module

Here is a example that how to set kpoints with **seekpath**.

Notice the return result is a `KpointsData` type, which can be used as _kpoints_ directly

````
```bash
from aiida_quantumespresso.calculations.functions.seekpath_structure_analysis import seekpath_structure_analysis
inputs = {
    'reference_distance': 0.01,
    'metadata': {'call_link_label': 'seekpath'}
}
spres = seekpath_structure_analysis(s, **inputs)
kpoints = spres['explicit_kpoints']
```
````

#### Two dimensions structure data

You may set the k-mesh and kpoints manually when the structure data is a two dimensions one by using code like this.

### About import and export data

#### Local data files

1. show or export _StructureData_
    
    > [export structure data](https://aiida-tutorials.readthedocs.io/en/latest/pages/2020_Intro_Week/sections/basics.html?highlight=xyz#structuredata)
    
    ```
     verdi data structure show --format ase <IDENTIFIER>
     verdi data structure export --format xsf <IDENTIFIER> > BaTiO3.xsf
     # xcrysden --xsf BaTiO3.xsf
    ```
    
2. import `xyz` data
    
    ```
     verdi data structure import aiida-xyz test.xyz
    ```
    
3. import `cif` data and transform to _structure_
    
    ```
     verdi data structure import ase 9008565.cif
     # or import as cifData
     verdi data cif import test.cif
     # or directly import from file in verdi shell
     > CifData = DataFactory('cif')
     > cif = CifData(file='/path/to/file.cif')
     > cif.store()
    ```
    
    use `get_structure` method to get _structure_ aiida supports.
    
    ```
     cif_struc = load_node(cif_data_pk)
     structure = cif.get_structure()
    ```
    

#### Cloud Databases

1. supported data ![2020-09-27-09-32-04](https://img-blog.csdnimg.cn/img_convert/c83c89c0004a59c37b2dd7cb42ce0375.png)
2. query structure data from cloud databases
    - Import tools
        
        ```
          from aiida.plugins import DbImporterFactory
        ```
        
    - Material Project
        
        ```
          MaterialsProjectImporter = DbImporterFactory('materialsproject')
          m = MaterialsProjectImporter(api_key=`Your_API_KEY`)
          query_dict = {"elements":{"$in":["Li", "Na", "K"], "$all": ["O"]}, "nelements":2}
          res = m.query(query=query_dict,properties='structure')
        ```
        
    - Cod
        
        > [external (online) repository COD](http://www.crystallography.net/cod/)
        > 
        > ```
        >   CODImporter = DbImporterFactory('cod')
        >   importer = CODImporter()
        >   args={
        >       'element': 'C',
        >       'title': '',
        >       'number_of_elements': 3,
        >   }
        >   query_results = importer.query(**args)
        > ```
        

#### Structure data group

1. create a group
    
    ```
     verdi group create [name]
    ```
    
2. add node to group
    
    ```
     verdi group add-node [pk]
     # add with python
     group = load_group(label='two-dimension')
     group.add_nodes(load_node({PK}))
    ```
    
3. query structure in a group
    
    ```
     qb = QueryBuilder()
     qb.append(Group, filters={'label': 'test'}, tag='group')
     qb.append(StructureData, with_group='group')
    
     # Submitting the simulations.
     for structure in qb.all(flat=True):
         print(structure.pk)
    ```
    

#### Export profile data

````
```bash
verdi export create [file] -G [group_name | pk]
```
````

### Write workflow for yourself

refer to a example here provided for pw and bands calculation

## Some concepts and commands about aiida

1. calculation functions require all returned output nodes to be unstored
2. work functions have exactly the opposite required and all the outputs that it returns have to be stored, it cannot create new data
3. go to work dir
    
    ```
     verdi calcjob gotocomputer [pk]
    ```
    

#### Issues :question:

1. import data
    
    ```
     verdi data structure import aiida-xyz 4afd2627-5695-49ee-8e2f-2d1f49bff3bb_structure.xyz
     > Critical: Number of atom entries (7) is smaller than the number of atoms (8)
    ```
    

## Appendix

\[^1\]: [pw example code](./pw)

````
```py
from aiida.plugins import DataFactory
from aiida.plugins.factories import CalculationFactory
from aiida.orm import Code
from aiida import load_profile
load_profile()

###############################
# Set your values here
codename = 'pwt@TheHive'
pseudo_family = 'ONCV'
###############################

code = Code.get_from_string(codename)
#code = Code.get(label='pw-6.3', machinename='TheHive')
#code = load_node(PK)


PwCalculation = CalculationFactory('quantumespresso.pw')
builder = PwCalculation.get_builder()
builder.code = code
#builder = code.get_builder()

StructureData = DataFactory('structure')

""" 
We define the cell with a 3x3 matrix(we choose the convention where each ROW represents a lattice vector), which in this case is just a cube of size 4 Angstroms
"""
alat = 4\.  # angstrom
cell = [[alat, 0., 0., ],
        [0., alat, 0., ],
        [0., 0., alat, ],
        ]
# BaTiO3 cubic structure
s = StructureData(cell=cell)
s.append_atom(position=(0.,0.,0.),symbols='Ba')
s.append_atom(position=(alat/2.,alat/2.,alat/2.),symbols='Ti')
s.append_atom(position=(alat/2.,alat/2.,0.),symbols='O')
s.append_atom(position=(alat/2.,0.,alat/2.),symbols='O')
s.append_atom(position=(0.,alat/2.,alat/2.),symbols='O')

# if need to store to database
# s.store()

Dict = DataFactory('dict')

parameters = Dict(dict={
    'CONTROL': {
        'calculation': 'scf',
        'restart_mode': 'from_scratch',
        'wf_collect': True,
    },
    'SYSTEM': {
        'ecutwfc': 30.,
        'ecutrho': 240.,
    },
    'ELECTRONS': {
        'conv_thr': 1.e-6,
    }
})

# parameters.store()

# define the input dictionary
test_dict = {
    'CONTROL': {
        'calculation': 'scf',
    },
    'SYSTEM': {
        'ecutwfc': 30.,
    },
    'ELECTRONS': {
        'conv_thr': 1.e-6,
    }
}

# verify and slightly modifiy input
resdict = CalculationFactory('quantumespresso.pw').input_helper(test_dict, structure=s)

# if add the flat_mode=True option to input_helper, the function will reconstruct the correct dictionary to pass as input
# resdict = CalculationFactory('quantumespresso.pw').input_helper(test_dict, structure=s, flat_mode == True)

parameters = Dict(dict=resdict)

KpointsData = DataFactory('array.kpoints')
kpoints = KpointsData()

# kpoints.set_kpoints_mesh([4,4,4])
kpoints.set_kpoints_mesh([4,4,4],offset=(0.5,0.5,0.5))

"""# specify kpoints manually
import numpy
kpoints.set_kpoints([[i,i,0] for i in numpy.linspace(0,1,10)],
    weights = [1\. for i in range(10)]) """

# pseudopotential
from aiida.orm.nodes.data.upf import get_pseudos_from_structure
builder.pseudos = get_pseudos_from_structure(s, pseudo_family)

# lable and description
builder.metadata.label = 'My generic title'
builder.metadata.description = 'a PWscf calculation of BaTiO3'

# calc resources
builder.metadata.options.resources = {'num_machines': 1, 'num_mpiprocs_per_machine' : 1}
builder.metadata.options.max_wallclock_seconds = 1800

# launch
builder.structure = s
builder.kpoints = kpoints
builder.parameters = parameters

# run
from aiida.engine import run
results = run(builder)
# export variable results
# results
# export variable builder
# builder

# without builder
# run(PwCalculation, structure=s, pseudos=builder.pseudos, kpoints = kpoints)
# run(process=code, structure=s, pseudos=builder.pseudos, kpoints = kpoints)

""" # submit
from aiida.engine import submit
calc = submit(builder) 
# retrieve result
calc.res
"""
```
````

\[^2\]: the current offical example code(v-3.1.0) isn't compatible with the latest aiida version, neither doesn't work with its command-line test tool, change it as follow

````
```py
# builder.metadata.options.resources = {'num_machines': 1}
# resource` need more than one properties such as
builder.metadata.options.resources = {'num_machines': 1, 'num_mpiprocs_per_machine' : 1}
```
````

\[^3\]: [ph example code](./ph)

````
```py
from aiida.plugins import CalculationFactory, DataFactory
from aiida.orm import Code
from aiida import load_profile, orm
from aiida.engine import submit
load_profile()

#####################
# ADAPT TO YOUR NEEDS
# pw parent calc node pk, ph calc as child proc
parent_id = 140
codename = 'pht@TheHive'
#####################

code = Code.get_from_string(codename)

PhCalculation = CalculationFactory('quantumespresso.ph')
builder = PhCalculation.get_builder()
builder.code = code

Dict = DataFactory('dict')
parameters = Dict(dict={
    'INPUTPH': {
        'tr2_ph': 1.0e-8,
        'epsil': True,
    }})

# QEPwCalc = CalculationFactory('quantumespresso.pw')
parentcalc = load_node(parent_id)

# builder = code.get_builder()
builder.metadata.options.resources = {'num_machines': 1, 'num_mpiprocs_per_machine' : 4}
builder.metadata.options.max_wallclock_seconds = 30*60
builder.metadata.options.withmpi = True

builder.parameters = parameters
builder.code = code
builder.parent_folder = parentcalc.get_outgoing(node_class=orm.RemoteData, link_label_filter='remote_folder').one().node

KpointsData = DataFactory('array.kpoints')
kpoints = KpointsData()

kpoints.set_kpoints_mesh([6,6,6])
builder.qpoints = kpoints
# builder.code.store_all()

print("created calculation with PK=", builder.code.pk)
calc = submit(builder)
calc
```
````

\[^4\]: [nscf code](./nscf)

````
```py
import os
import numpy as np
from aiida.engine import submit
from aiida import orm

PwCalculation = CalculationFactory('quantumespresso.pw')

# first pw calc node pk
first_pw = load_node(140)
builder = first_pw.get_builder_restart()
updated_parameters = builder.parameters.get_dict()
updated_parameters['CONTROL']['calculation'] = 'nscf'
updated_parameters['SYSTEM']['nbnd'] = 10

KpointsData = DataFactory('array.kpoints')
kpoints = KpointsData()

klist = np.zeros((216, 3))
tt = 0
for ii in np.arange(0, 1, 1.0/6):
for jj in np.arange(0, 1, 1.0/6):
    for kk in np.arange(0, 1, 1.0/6):
    klist[tt, :] = np.array([ii, jj, kk])
    tt += 1
kpoints.set_kpoints(klist, cartesian = False, weights= np.ones(216)*1.0/216)
kpoints.store()

builder.kpoints = kpoints
builder.parameters = Dict(dict=updated_parameters)

builder.parent_folder = first_pw.outputs.remote_folder

submit(builder)
```
````

\[^5\]: [bands code](./bands)

\[^6\]: [q2r code](./q2r)

````
```python
from aiida.engine import submit
from aiida import orm
######set yours here######
ph_pk = 288
q2r_codename = 'q2rt@TheHive'
##########################
# set ph node pk
ph_calc = load_node(ph_pk)

# load q2r code
codename = q2r_codename

code = orm.Code.get_from_string(codename)
builder = code.get_builder()
builder.parent_folder = ph_calc.get_outgoing(
    node_class=orm.RemoteData, link_label_filter='remote_folder').one().node
builder.metadata.options.update({
    'resources': {
        'num_machines': 1,
        'num_mpiprocs_per_machine': 4
    },
    'max_wallclock_seconds': 30*60,
    'withmpi': True
})
calc = submit(builder)
calc
```
````
