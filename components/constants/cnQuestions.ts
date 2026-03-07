import { Question } from "../../types"

// FUNDAMENTALS (cn_1 – cn_34)
export const cnFundamentals: Question[] = [
  { id: 'cn_1', title: 'Explain the OSI Model Layers', difficulty: 'Concept', link: 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/' },
  { id: 'cn_2', title: 'TCP vs UDP: Differences and Use Cases', difficulty: 'Easy', link: 'https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/' },
  { id: 'cn_3', title: 'Explain the TCP 3-Way Handshake', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/tcp-3-way-handshake-process/' },
  { id: 'cn_4', title: 'What happens when you type a URL in the browser?', difficulty: 'Medium', link: 'https://github.com/alex/what-happens-when' },
  { id: 'cn_5', title: 'DNS Resolution Process', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/dns/what-is-dns/' },
  { id: 'cn_6', title: 'HTTP Methods (GET, POST, PUT, DELETE)', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods' },
  { id: 'cn_7', title: 'HTTP vs HTTPS', difficulty: 'Easy', link: 'https://www.cloudflare.com/learning/ssl/why-is-http-not-secure/' },

  { id: 'cn_8', title: 'TCP/IP Model vs OSI Model', difficulty: 'Concept', link: 'https://www.geeksforgeeks.org/difference-between-tcp-ip-model-and-osi-model/' },
  { id: 'cn_9', title: 'What is ARP (Address Resolution Protocol)?', difficulty: 'Easy', link: 'https://www.cloudflare.com/learning/ddos/what-is-arp-spoofing/' },
  { id: 'cn_10', title: 'MAC Address vs IP Address', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/differences-between-ip-address-and-mac-address/' },

  { id: 'cn_11', title: 'Subnetting and CIDR Notation', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/introduction-of-subnetting/' },
  { id: 'cn_12', title: 'What is a Default Gateway?', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/what-is-gateway-in-computer-network/' },
  { id: 'cn_13', title: 'DHCP: Dynamic Host Configuration Protocol', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/dns/what-is-dhcp/' },
  { id: 'cn_14', title: 'NAT (Network Address Translation) and its Types', difficulty: 'Medium', link: 'https://www.cisco.com/c/en/us/support/docs/ip/network-address-translation-nat/4606-nat-types.html' },
  { id: 'cn_15', title: 'Difference between Hub, Switch, and Router', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/difference-between-hub-switch-and-router/' },

  { id: 'cn_16', title: 'What is a VLAN and why is it used?', difficulty: 'Medium', link: 'https://www.cisco.com/c/en/us/solutions/small-business/resource-center/networking/what-is-vlan.html' },
  { id: 'cn_17', title: 'Spanning Tree Protocol (STP)', difficulty: 'Hard', link: 'https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/5234-5.html' },
  { id: 'cn_18', title: 'Routing vs Switching', difficulty: 'Concept', link: 'https://www.geeksforgeeks.org/difference-between-switching-and-routing/' },
  { id: 'cn_19', title: 'Distance Vector vs Link State Routing', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/difference-between-distance-vector-routing-and-link-state-routing/' },
  { id: 'cn_20', title: 'Static Routing vs Dynamic Routing', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/difference-between-static-routing-and-dynamic-routing/' },

  { id: 'cn_21', title: 'Overview of BGP (Border Gateway Protocol)', difficulty: 'Hard', link: 'https://www.cloudflare.com/learning/security/glossary/what-is-bgp/' },
  { id: 'cn_22', title: 'Overview of OSPF (Open Shortest Path First)', difficulty: 'Hard', link: 'https://www.cisco.com/c/en/us/products/ios-nx-os-software/open-shortest-path-first-ospf/index.html' },
  { id: 'cn_23', title: 'RIP Protocol Basics', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/routing-information-protocol-rip/' },
  { id: 'cn_24', title: 'What is MPLS?', difficulty: 'Hard', link: 'https://www.cisco.com/c/en/us/solutions/service-provider/mpls/index.html' },
  { id: 'cn_25', title: 'QoS (Quality of Service) in Networks', difficulty: 'Hard', link: 'https://www.cisco.com/c/en/us/solutions/enterprise-networks/quality-of-service-qos/index.html' },

  { id: 'cn_26', title: 'TCP Flow Control and Sliding Window', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/sliding-window-protocol-set-1/' },
  { id: 'cn_27', title: 'TCP Congestion Control (Slow Start, AIMD)', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/tcp-congestion-control/' },
  { id: 'cn_28', title: 'What is MTU and Fragmentation?', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/network-layer/what-is-mtu/' },
  { id: 'cn_29', title: 'ICMP and Tools: ping, traceroute', difficulty: 'Easy', link: 'https://www.cloudflare.com/learning/ddos/glossary/internet-control-message-protocol-icmp/' },
  { id: 'cn_30', title: 'Ports and Sockets in Networking', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/socket-in-computer-network/' },

  { id: 'cn_31', title: 'IPv4 vs IPv6: Differences and Motivation', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/ddos/glossary/internet-protocol/' },
  { id: 'cn_32', title: 'CIDR vs Traditional Subnetting', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/classless-addressing/' },
  { id: 'cn_33', title: 'Private vs Public IP Addresses', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/differences-between-private-and-public-ip-addresses/' },
  { id: 'cn_34', title: 'Unicast, Broadcast, Multicast, Anycast', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/ddos/glossary/unicast-broadcast-anycast-multicast/' },
]

// ADVANCED NETWORKING (cn_35 – cn_67)
export const cnAdvanced: Question[] = [
  { id: 'cn_35', title: 'ARP Spoofing / Poisoning Attack', difficulty: 'Hard', link: 'https://www.cloudflare.com/learning/ddos/what-is-arp-spoofing/' },

  { id: 'cn_36', title: 'DNS Caching and TTL', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/dns/dns-caching/' },
  { id: 'cn_37', title: 'Recursive vs Iterative DNS Queries', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/dns/dns-server-types/' },
  { id: 'cn_38', title: 'DNS Spoofing / Cache Poisoning', difficulty: 'Hard', link: 'https://www.cloudflare.com/learning/dns/dns-cache-poisoning/' },
  { id: 'cn_39', title: 'CDN (Content Delivery Network) Basics', difficulty: 'Concept', link: 'https://www.cloudflare.com/learning/cdn/what-is-a-cdn/' },
  { id: 'cn_40', title: 'Proxy vs Reverse Proxy', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/' },

  { id: 'cn_41', title: 'Forward Proxy vs Transparent Proxy', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/cdn/glossary/proxy-server/' },
  { id: 'cn_42', title: 'Load Balancer: Layer 4 vs Layer 7', difficulty: 'Medium', link: 'https://www.nginx.com/resources/glossary/layer-4-load-balancing/' },
  { id: 'cn_43', title: 'Session Persistence / Sticky Sessions', difficulty: 'Medium', link: 'https://www.nginx.com/blog/load-balancing-and-session-persistence/' },
  { id: 'cn_44', title: 'Firewall Basics (Packet Filter vs Stateful)', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/ddos/glossary/stateful-firewall/' },
  { id: 'cn_45', title: 'Intrusion Detection Systems (IDS) vs IPS', difficulty: 'Hard', link: 'https://www.cisco.com/c/en/us/products/security/what-is-an-ids-ips.html' },

  { id: 'cn_46', title: 'VPN: Site-to-Site vs Remote Access', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/vpn/what-is-a-vpn/' },
  { id: 'cn_47', title: 'IPSec Basics', difficulty: 'Hard', link: 'https://www.cisco.com/c/en/us/products/security/vpn-endpoint-security-clients/what-is-ipsec.html' },
  { id: 'cn_48', title: 'SSL/TLS Handshake Overview', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/' },
  { id: 'cn_49', title: 'Certificates, CAs, and PKI', difficulty: 'Hard', link: 'https://letsencrypt.org/how-it-works/' },
  { id: 'cn_50', title: 'HSTS, HPKP, and HTTPS Strictness', difficulty: 'Hard', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security' },

  { id: 'cn_51', title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3', difficulty: 'Hard', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP' },
  { id: 'cn_52', title: 'Keep-Alive Connections and Pipelining', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive' },
  { id: 'cn_53', title: 'What is QUIC?', difficulty: 'Hard', link: 'https://www.cloudflare.com/learning/ddos/what-is-quic/' },
  { id: 'cn_54', title: 'HTTP Status Codes: 1xx–5xx Overview', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' },
  { id: 'cn_55', title: 'Cookies vs Sessions vs Tokens', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies' },

  { id: 'cn_56', title: 'WebSockets: Handshake and Use Cases', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API' },
  { id: 'cn_57', title: 'Server-Sent Events (SSE) vs WebSockets', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events' },
  { id: 'cn_58', title: 'Long Polling vs Short Polling', difficulty: 'Medium', link: 'https://ably.com/topic/polling' },
  { id: 'cn_59', title: 'REST over HTTP: Idempotency and Safe Methods', difficulty: 'Medium', link: 'https://restfulapi.net/http-methods/' },
  { id: 'cn_60', title: 'gRPC vs REST over HTTP/JSON', difficulty: 'Medium', link: 'https://grpc.io/docs/what-is-grpc/introduction/' },

  { id: 'cn_61', title: 'CSMA/CD in Ethernet', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/carrier-sense-multiple-access-with-collision-detection-csmacd/' },
  { id: 'cn_62', title: 'CSMA/CA in Wi-Fi', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/carrier-sense-multiple-access-with-collision-avoidance-csmaca/' },
  { id: 'cn_63', title: '802.11 Wi-Fi Standards (a/b/g/n/ac/ax)', difficulty: 'Medium', link: 'https://www.cisco.com/c/en/us/products/wireless/what-is-802-11ax.html' },
  { id: 'cn_64', title: 'Hidden Node and Exposed Node Problems', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/difference-between-hidden-node-and-exposed-node-problem/' },
  { id: 'cn_65', title: 'Wi-Fi Security: WEP, WPA, WPA2, WPA3', difficulty: 'Medium', link: 'https://www.kaspersky.com/resource-center/definitions/what-is-wpa' },

  { id: 'cn_66', title: 'Physical vs Logical Topologies (Bus, Star, Ring, Mesh)', difficulty: 'Concept', link: 'https://www.geeksforgeeks.org/types-of-network-topology/' },
  { id: 'cn_67', title: 'Circuit Switching vs Packet Switching', difficulty: 'Concept', link: 'https://www.geeksforgeeks.org/differences-between-circuit-switching-and-packet-switching/' },
]

// SYSTEM & ARCHITECTURE (cn_68 – cn_100)
export const cnSystemAndArchitecture: Question[] = [
  { id: 'cn_68', title: 'TDM, FDM, and WDM Multiplexing', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/difference-between-fdm-and-tdm/' },
  { id: 'cn_69', title: 'NRZ, Manchester and Differential Encoding', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/line-coding-nrz-unipolar-scheme/' },
  { id: 'cn_70', title: 'Error Detection: Parity, Checksum, CRC', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/error-detection-in-computer-networks/' },

  { id: 'cn_71', title: 'Hamming Code and Error Correction', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/hamming-code-in-computer-network/' },
  { id: 'cn_72', title: 'Stop-and-Wait ARQ Protocol', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/stop-and-wait-arq/' },
  { id: 'cn_73', title: 'Go-Back-N ARQ Protocol', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/go-back-n-arq/' },
  { id: 'cn_74', title: 'Selective Repeat ARQ Protocol', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/selective-repeat-arq-practical/' },
  { id: 'cn_75', title: 'Jitter, Latency, and Bandwidth', difficulty: 'Concept', link: 'https://www.cloudflare.com/learning/network-layer/what-is-latency/' },

  { id: 'cn_76', title: 'What is a Socket? TCP vs UDP Sockets', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/socket-programming-in-cc-handling-multiple-clients-on-server-without-multi-threading/' },
  { id: 'cn_77', title: 'Ephemeral Ports and Well-Known Ports', difficulty: 'Medium', link: 'https://www.ibm.com/docs/en/aix/7.2?topic=protocols-tcpip-ports' },
  { id: 'cn_78', title: 'Connection-Oriented vs Connectionless Services', difficulty: 'Concept', link: 'https://www.geeksforgeeks.org/connection-oriented-and-connectionless-services/' },
  { id: 'cn_79', title: 'Nagle’s Algorithm and Delayed ACKs', difficulty: 'Hard', link: 'https://datatracker.ietf.org/doc/html/rfc896' },
  { id: 'cn_80', title: 'Head-of-Line (HoL) Blocking in Networks', difficulty: 'Hard', link: 'https://www.cloudflare.com/learning/performance/head-of-line-blocking/' },

  { id: 'cn_81', title: 'DDoS Attacks: Types and Mitigation', difficulty: 'Hard', link: 'https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/' },
  { id: 'cn_82', title: 'Smurf, SYN Flood, and Ping of Death Attacks', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/types-of-ddos-attacks/' },
  { id: 'cn_83', title: 'Man-in-the-Middle (MITM) Attacks in Networks', difficulty: 'Hard', link: 'https://www.kaspersky.com/resource-center/definitions/man-in-the-middle-attacks' },
  { id: 'cn_84', title: 'Network Sniffing and Packet Analysis (Wireshark)', difficulty: 'Medium', link: 'https://www.wireshark.org/docs/wsug_html/' },
  { id: 'cn_85', title: 'Zero Trust Networking Basics', difficulty: 'Concept', link: 'https://www.cloudflare.com/learning/security/what-is-zero-trust/' },

  { id: 'cn_86', title: 'Software Defined Networking (SDN)', difficulty: 'Hard', link: 'https://www.opennetworking.org/sdn-definition/' },
  { id: 'cn_87', title: 'Network Function Virtualization (NFV)', difficulty: 'Hard', link: 'https://www.opennetworking.org/nfv/' },
  { id: 'cn_88', title: 'Overlay Networks and Tunnels (GRE, VXLAN)', difficulty: 'Hard', link: 'https://www.cisco.com/c/en/us/td/docs/switches/datacenter/nexus5600/sw/layer2/7x/b_5600_Layer2_Config_7x/b_5600_Layer2_Config_7x_chapter_010010.html' },
  { id: 'cn_89', title: 'Anycast in CDNs and DNS', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/cdn/glossary/anycast-network/' },
  { id: 'cn_90', title: 'Multihoming and Redundancy in Networks', difficulty: 'Hard', link: 'https://www.cloudflare.com/learning/cdn/glossary/multihomed-network/' },

  { id: 'cn_91', title: 'Routing Tables and Forwarding Tables', difficulty: 'Medium', link: 'https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13769-3.html' },
  { id: 'cn_92', title: 'Spanning Tree: Root Bridge and Port Roles', difficulty: 'Hard', link: 'https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/5234-5.html' },
  { id: 'cn_93', title: 'VLAN Trunking (802.1Q)', difficulty: 'Hard', link: 'https://www.cisco.com/c/en/us/support/docs/lan-switching/virtual-lan-vlan/10023-3.html' },
  { id: 'cn_94', title: 'Multicast Routing (IGMP, PIM)', difficulty: 'Hard', link: 'https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipmulti_proto/configuration/xe-3s/imc-xe-3s-book/ipmc-oview.html' },
  { id: 'cn_95', title: 'Route Flapping and Route Convergence', difficulty: 'Hard', link: 'https://www.cisco.com/c/en/us/support/docs/ip/border-gateway-protocol-bgp/116146-problems-bgp-convergence.html' },

  { id: 'cn_96', title: 'Mobile Networks: 3G vs 4G vs 5G Basics', difficulty: 'Concept', link: 'https://www.qualcomm.com/news/onq/2019/12/what-difference-between-3g-4g-and-5g' },
  { id: 'cn_97', title: 'Edge Computing vs Cloud Computing in Networking', difficulty: 'Concept', link: 'https://www.cloudflare.com/learning/serverless/what-is-edge-computing/' },
  { id: 'cn_98', title: 'NAT Traversal and STUN/TURN for WebRTC', difficulty: 'Hard', link: 'https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols' },
  { id: 'cn_99', title: 'Overlay Networks in Kubernetes (CNI, Flannel, Calico)', difficulty: 'Hard', link: 'https://kubernetes.io/docs/concepts/cluster-administration/networking/' },
  { id: 'cn_100', title: 'End-to-End Principle in Network Design', difficulty: 'Concept', link: 'https://web.mit.edu/Saltzer/www/publications/endtoend/endtoend.pdf' },
]

// Full flat list (for counts / legacy usage)
export const cnQuestions: Question[] = [
  ...cnFundamentals,
  ...cnAdvanced,
  ...cnSystemAndArchitecture,
]