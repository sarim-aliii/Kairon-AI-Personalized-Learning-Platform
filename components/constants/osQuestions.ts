import { Question } from "../../types"

export const osQuestions: Question[] = [
    { id: 'os_1', title: 'What is an Operating System?', difficulty: 'Easy', link: 'https://en.wikipedia.org/wiki/Operating_system' },
    { id: 'os_2', title: 'Types of Operating Systems', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/types-of-operating-systems/' },
    { id: 'os_3', title: 'Kernel vs User Space', difficulty: 'Easy', link: 'https://en.wikipedia.org/wiki/User_space_and_kernel_space' },
    { id: 'os_4', title: 'Monolithic Kernel vs Microkernel', difficulty: 'Medium', link: 'https://developer.ibm.com/articles/l-monolithic-microkernel/' },
    { id: 'os_5', title: 'System Calls and APIs', difficulty: 'Medium', link: 'https://man7.org/linux/man-pages/man2/syscalls.2.html' },

    { id: 'os_6', title: 'Processes vs Threads', difficulty: 'Easy', link: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/procthread.html' },
    { id: 'os_7', title: 'Process Life Cycle', difficulty: 'Easy', link: 'https://en.wikipedia.org/wiki/Process_management_(computing)' },
    { id: 'os_8', title: 'Context Switching', difficulty: 'Medium', link: 'https://linux-kernel-labs.github.io/refs/heads/master/lectures/context-switching.html' },
    { id: 'os_9', title: 'Process Scheduling Algorithms', difficulty: 'Medium', link: 'https://www.javatpoint.com/os-process-scheduling' },
    { id: 'os_10', title: 'Multithreading and Concurrency', difficulty: 'Medium', link: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/' },

    { id: 'os_11', title: 'CPU Scheduling: FCFS, SJF, RR', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/' },
    { id: 'os_12', title: 'Mutex, Semaphore, Spinlocks', difficulty: 'Medium', link: 'https://en.wikipedia.org/wiki/Semaphore_(programming)' },
    { id: 'os_13', title: 'Deadlock Detection and Prevention', difficulty: 'Medium', link: 'https://www.javatpoint.com/deadlock-in-operating-system' },
    { id: 'os_14', title: 'Thread Synchronization', difficulty: 'Medium', link: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/locksync.html' },
    { id: 'os_15', title: 'Race Conditions and Critical Sections', difficulty: 'Medium', link: 'https://en.wikipedia.org/wiki/Race_condition' },

    { id: 'os_16', title: 'Memory Management Basics', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/memory-management-in-operating-system/' },
    { id: 'os_17', title: 'Virtual Memory and Paging', difficulty: 'Medium', link: 'https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/9_MemoryMgmt.html' },
    { id: 'os_18', title: 'TLB (Translation Lookaside Buffer)', difficulty: 'Medium', link: 'https://en.wikipedia.org/wiki/Translation_lookaside_buffer' },
    { id: 'os_19', title: 'Segmentation vs Paging', difficulty: 'Medium', link: 'https://www.studytonight.com/operating-system/segmentation' },
    { id: 'os_20', title: 'Demand Paging and Swapping', difficulty: 'Medium', link: 'https://www.javatpoint.com/demand-paging-in-operating-system' },

    { id: 'os_21', title: 'Page Replacement Algorithms', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/' },
    { id: 'os_22', title: 'Buddy Allocator System', difficulty: 'Hard', link: 'https://en.wikipedia.org/wiki/Buddy_memory_allocation' },
    { id: 'os_23', title: 'Fragmentation: Internal / External', difficulty: 'Medium', link: 'https://www.guru99.com/os-memory-management.html' },
    { id: 'os_24', title: 'Heap vs Stack Memory', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/stack-vs-heap-memory-allocation/' },
    { id: 'os_25', title: 'Memory-Mapped Files', difficulty: 'Medium', link: 'https://man7.org/linux/man-pages/man2/mmap.2.html' },

    { id: 'os_26', title: 'File System Basics', difficulty: 'Medium', link: 'https://en.wikipedia.org/wiki/File_system' },
    { id: 'os_27', title: 'Ext4 vs NTFS vs XFS vs Btrfs', difficulty: 'Medium', link: 'https://wiki.archlinux.org/title/File_systems' },
    { id: 'os_28', title: 'Journaling File Systems', difficulty: 'Medium', link: 'https://www.techtarget.com/searchstorage/definition/journaling-file-system' },
    { id: 'os_29', title: 'Inodes, Superblocks, Metadata', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/inode-in-operating-system/' },
    { id: 'os_30', title: 'Directory Structures and Path Resolution', difficulty: 'Medium', link: 'https://tldp.org/LDP/intro-linux/html/sect_03_01.html' },

    { id: 'os_31', title: 'I/O Subsystem in OS', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/i-o-hardware/' },
    { id: 'os_32', title: 'Interrupts vs Polling', difficulty: 'Easy', link: 'https://en.wikipedia.org/wiki/Interrupt' },
    { id: 'os_33', title: 'DMA (Direct Memory Access)', difficulty: 'Medium', link: 'https://en.wikipedia.org/wiki/Direct_memory_access' },
    { id: 'os_34', title: 'Device Driver Architecture', difficulty: 'Hard', link: 'https://www.kernel.org/doc/Documentation/driver-model/design-patterns.txt' },
    { id: 'os_35', title: 'Block vs Character Devices', difficulty: 'Medium', link: 'https://www.tldp.org/LDP/tlk/dd/disc.html' },

    { id: 'os_36', title: 'Linux Boot Process', difficulty: 'Medium', link: 'https://www.thegeekstuff.com/2011/02/linux-boot-process/' },
    { id: 'os_37', title: 'GRUB and Bootloaders', difficulty: 'Medium', link: 'https://www.gnu.org/software/grub/manual/grub/grub.html' },
    { id: 'os_38', title: 'Systemd Overview', difficulty: 'Medium', link: 'https://www.freedesktop.org/wiki/Software/systemd/' },
    { id: 'os_39', title: 'Init Systems: sysvinit vs systemd', difficulty: 'Medium', link: 'https://wiki.archlinux.org/title/Init' },
    { id: 'os_40', title: 'Kernel Modules and Loadable Drivers', difficulty: 'Hard', link: 'https://tldp.org/HOWTO/Module-HOWTO/' },

    { id: 'os_41', title: 'Signals and Interprocess Communication (IPC)', difficulty: 'Medium', link: 'https://man7.org/linux/man-pages/man7/signal.7.html' },
    { id: 'os_42', title: 'Pipes, FIFOs, Message Queues', difficulty: 'Medium', link: 'https://man7.org/linux/man-pages/man7/pipe.7.html' },
    { id: 'os_43', title: 'Shared Memory and Semaphores', difficulty: 'Medium', link: 'https://man7.org/linux/man-pages/man7/shm_overview.7.html' },
    { id: 'os_44', title: 'Sockets and RPC', difficulty: 'Hard', link: 'https://man7.org/linux/man-pages/man7/socket.7.html' },
    { id: 'os_45', title: 'Signals vs Interrupts vs Traps', difficulty: 'Hard', link: 'https://en.wikipedia.org/wiki/Trap_(computing)' },

    { id: 'os_46', title: 'Shell and Command Interpreters', difficulty: 'Easy', link: 'https://www.gnu.org/software/bash/manual/bash.html' },
    { id: 'os_47', title: 'Environment Variables', difficulty: 'Easy', link: 'https://www.gnu.org/software/coreutils/manual/html_node/Environment-Variables.html' },
    { id: 'os_48', title: 'Shell Scripting Basics', difficulty: 'Medium', link: 'https://tldp.org/HOWTO/Bash-Prog-Intro-HOWTO.html' },
    { id: 'os_49', title: 'Cron Jobs and Scheduling', difficulty: 'Easy', link: 'https://man7.org/linux/man-pages/man8/cron.8.html' },
    { id: 'os_50', title: 'Package Managers (apt/yum/pacman)', difficulty: 'Medium', link: 'https://wiki.archlinux.org/title/Pacman' },
    
    { id: 'os_51', title: 'Linux Permissions: rwx, chmod, chown', difficulty: 'Easy', link: 'https://man7.org/linux/man-pages/man1/chmod.1.html' },
    { id: 'os_52', title: 'ACLs and Extended Attributes', difficulty: 'Medium', link: 'https://wiki.archlinux.org/title/Access_Control_Lists' },
    { id: 'os_53', title: 'Linux Capabilities', difficulty: 'Hard', link: 'https://man7.org/linux/man-pages/man7/capabilities.7.html' },
    { id: 'os_54', title: 'SELinux / AppArmor Basics', difficulty: 'Hard', link: 'https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/chap-security_guide-selinux' },
    { id: 'os_55', title: 'User Management: /etc/passwd, /etc/shadow', difficulty: 'Medium', link: 'https://man7.org/linux/man-pages/man5/passwd.5.html' },

    { id: 'os_56', title: 'Scheduling Classes (CFS)', difficulty: 'Hard', link: 'https://www.kernel.org/doc/Documentation/scheduler/sched-design-CFS.txt' },
    { id: 'os_57', title: 'Real-time Scheduling', difficulty: 'Hard', link: 'https://man7.org/linux/man-pages/man7/sched.7.html' },
    { id: 'os_58', title: 'Priority Inversion & Priority Inheritance', difficulty: 'Hard', link: 'https://en.wikipedia.org/wiki/Priority_inversion' },
    { id: 'os_59', title: 'NUMA Architecture', difficulty: 'Hard', link: 'https://en.wikipedia.org/wiki/Non-uniform_memory_access' },
    { id: 'os_60', title: 'Hyperthreading vs Multicore CPUs', difficulty: 'Medium', link: 'https://www.intel.com/content/www/us/en/gaming/resources/hyper-threading.html' },

    { id: 'os_61', title: 'Kernel Preemption Models', difficulty: 'Hard', link: 'https://wiki.archlinux.org/title/Kernel/Arch' },
    { id: 'os_62', title: 'System Profiling with strace & perf', difficulty: 'Medium', link: 'https://man7.org/linux/man-pages/man1/strace.1.html' },
    { id: 'os_63', title: 'Signals: SIGKILL, SIGTERM, SIGSTOP', difficulty: 'Medium', link: 'https://man7.org/linux/man-pages/man7/signal.7.html' },
    { id: 'os_64', title: 'Zombie & Orphan Processes', difficulty: 'Medium', link: 'https://en.wikipedia.org/wiki/Zombie_process' },
    { id: 'os_65', title: 'CPU Affinity and Taskset', difficulty: 'Hard', link: 'https://man7.org/linux/man-pages/man1/taskset.1.html' },

    { id: 'os_66', title: 'Filesystem Caching & Buffer Cache', difficulty: 'Medium', link: 'https://www.kernel.org/doc/gorman/html/understand/understand010.html' },
    { id: 'os_67', title: 'Write-back vs Write-through', difficulty: 'Medium', link: 'https://en.wikipedia.org/wiki/Cache_(computing)' },
    { id: 'os_68', title: 'RAID Levels (0,1,5,10)', difficulty: 'Medium', link: 'https://www.techtarget.com/searchstorage/definition/RAID' },
    { id: 'os_69', title: 'FUSE Filesystems', difficulty: 'Hard', link: 'https://github.com/libfuse/libfuse' },
    { id: 'os_70', title: 'SSD vs HDD I/O Behavior', difficulty: 'Easy', link: 'https://www.backblaze.com/blog/hard-drive-buying-guide/' },

    { id: 'os_71', title: 'Swap Space and OOM Killer', difficulty: 'Medium', link: 'https://www.kernel.org/doc/gorman/html/understand/understand014.html' },
    { id: 'os_72', title: 'HugePages and THP', difficulty: 'Hard', link: 'https://www.kernel.org/doc/Documentation/vm/hugetlbpage.txt' },
    { id: 'os_73', title: 'Cgroups v1 vs v2', difficulty: 'Hard', link: 'https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html' },
    { id: 'os_74', title: 'Namespaces (PID, NET, IPC, UTS, MNT)', difficulty: 'Hard', link: 'https://man7.org/linux/man-pages/man7/namespaces.7.html' },
    { id: 'os_75', title: 'Containers as OS-level Virtualization', difficulty: 'Hard', link: 'https://en.wikipedia.org/wiki/Operating-system-level_virtualization' },

    { id: 'os_76', title: 'Virtualization vs Bare Metal OS', difficulty: 'Medium', link: 'https://www.redhat.com/en/topics/virtualization/what-is-virtualization' },
    { id: 'os_77', title: 'Paravirtualization vs Hardware Virtualization', difficulty: 'Hard', link: 'https://wiki.archlinux.org/title/KVM' },
    { id: 'os_78', title: 'KVM vs Xen vs VMware ESXi', difficulty: 'Hard', link: 'https://www.linux-kvm.org/page/Main_Page' },
    { id: 'os_79', title: 'QEMU and CPU Emulation', difficulty: 'Hard', link: 'https://www.qemu.org/docs/master/' },
    { id: 'os_80', title: 'Hypervisor Types (Type 1 & 2)', difficulty: 'Medium', link: 'https://opensource.com/article/19/3/what-hypervisor' },

    { id: 'os_81', title: 'Windows Architecture Internals', difficulty: 'Hard', link: 'https://learn.microsoft.com/en-us/sysinternals/' },
    { id: 'os_82', title: 'Linux Kernel Internals Overview', difficulty: 'Hard', link: 'https://www.kernel.org/doc/html/latest/' },
    { id: 'os_83', title: 'MacOS (Darwin / XNU Kernel)', difficulty: 'Hard', link: 'https://opensource.apple.com/' },
    { id: 'os_84', title: 'Android OS Internals', difficulty: 'Hard', link: 'https://source.android.com/' },
    { id: 'os_85', title: 'iOS/Apple Security Architecture', difficulty: 'Hard', link: 'https://www.apple.com/business/docs/site/iOS_Security_Guide.pdf' },

    { id: 'os_86', title: 'Power Management (C-states, P-states)', difficulty: 'Hard', link: 'https://www.kernel.org/doc/Documentation/power/' },
    { id: 'os_87', title: 'ACPI and BIOS vs UEFI', difficulty: 'Medium', link: 'https://wiki.archlinux.org/title/Unified_Extensible_Firmware_Interface' },
    { id: 'os_88', title: 'Kernel Panic and Debugging', difficulty: 'Hard', link: 'https://wiki.archlinux.org/title/Kernel_panic' },
    { id: 'os_89', title: 'Kernel Debugging with GDB/Crash', difficulty: 'Hard', link: 'https://www.kernel.org/doc/html/latest/dev-tools/gdb-kernel-debugging.html' },
    { id: 'os_90', title: 'Tracing with eBPF', difficulty: 'Hard', link: 'https://ebpf.io/' },

    { id: 'os_91', title: 'Distributed OS Concepts', difficulty: 'Hard', link: 'https://en.wikipedia.org/wiki/Distributed_operating_system' },
    { id: 'os_92', title: 'Clustered File Systems (Ceph, GlusterFS)', difficulty: 'Hard', link: 'https://docs.ceph.com/en/latest/' },
    { id: 'os_93', title: 'Microservices vs OS Processes', difficulty: 'Medium', link: 'https://martinfowler.com/articles/microservices.html' },
    { id: 'os_94', title: 'Real-Time OS (RTOS) Concepts', difficulty: 'Hard', link: 'https://docs.freebsd.org/en/books/arch-handbook/rt/' },
    { id: 'os_95', title: 'Embedded OS (RTEMS, FreeRTOS)', difficulty: 'Hard', link: 'https://www.freertos.org/' },

    { id: 'os_96', title: 'Operating System Security Models', difficulty: 'Hard', link: 'https://csrc.nist.gov/glossary/term/security_model' },
    { id: 'os_97', title: 'Sandboxing and Isolation', difficulty: 'Hard', link: 'https://man7.org/linux/man-pages/man7/seccomp.7.html' },
    { id: 'os_98', title: 'Secure Boot and Verified Boot', difficulty: 'Hard', link: 'https://www.kernel.org/doc/Documentation/module-signing.txt' },
    { id: 'os_99', title: 'Kernel Hardening Techniques', difficulty: 'Hard', link: 'https://kernel.org/doc/html/latest/admin-guide/hardening.html' },
    { id: 'os_100', title: 'How to Design a Modern Operating System', difficulty: 'Hard', link: 'https://osdev.org' },
]

// ========================= 1) OS FUNDAMENTALS =========================
// Easy + Concept — intro OS, processes, basic memory, shell, etc.
export const osFundamentals: Question[] = osQuestions.filter(q =>
  ['Easy', 'Concept'].includes(q.difficulty)
);

// ========================= 2) OS ADVANCED (CORE CONCEPTS) =========================
// Mostly Medium — scheduling, concurrency, memory, FS, virtualization basics
export const osAdvanced: Question[] = osQuestions.filter(q =>
  q.difficulty === 'Medium'
);

// ========================= 3) OS SYSTEM & ARCHITECTURE / INTERNALS =========================
// Hard — kernel internals, RTOS, containers, security, distributed OS
export const osSystemAndArchitecture: Question[] = osQuestions.filter(q =>
  q.difficulty === 'Hard'
);
