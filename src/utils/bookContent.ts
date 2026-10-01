import { jsPDF } from 'jspdf';
import { StudyResource, BookChapter, PYQPaper } from '../types';

export const DEFAULT_DSA_CHAPTERS: BookChapter[] = [
  {
    id: 'ch-1',
    chapterNumber: 1,
    title: 'Unit 1: Introduction to Data Structures & Asymptotic Analysis',
    subtitle: 'Space-Time Complexity, Asymptotic Notations (Big-O, Omega, Theta), and Arrays',
    pagesRange: 'pp. 1 - 45',
    keyTopics: ['Time & Space Complexity', 'Big-O, Ω, Θ Definitions', 'Row-Major & Column-Major Ordering', 'Sparse Matrix Representation'],
    formulas: [
      'Row-Major Address: Loc(A[i][j]) = Base + [(i - LB1) * N + (j - LB2)] * W',
      'Column-Major Address: Loc(A[i][j]) = Base + [(j - LB2) * M + (i - LB1)] * W',
      'Big-O Definition: f(n) <= c * g(n) for all n >= n0 where c > 0 and n0 >= 1',
    ],
    examQuestions: [
      'Q1: Derive the address formula for a 2D array stored in Row-Major order. (AKTU 2024, 7 Marks)',
      'Q2: Compare Time Complexity of Linear Search vs Binary Search with Best, Average, and Worst cases.',
      'Q3: What is a Sparse Matrix? Write the 3-tuple representation and explain its transpose.',
    ],
    content: `### 1.1 Concept of Data Structures
A **Data Structure** is a specialized format for organizing, processing, retrieving, and storing data in computer memory. Algorithms operate on data structures to perform computations efficiently.

#### Classification:
* **Primitive Data Structures:** Directly operated upon by machine instructions (e.g., \`int\`, \`float\`, \`char\`, \`pointers\`).
* **Non-Primitive Linear Data Structures:** Elements form a sequential sequence where each element has a unique predecessor and successor (except ends). Examples: *Arrays, Stacks, Queues, Linked Lists*.
* **Non-Primitive Non-Linear Data Structures:** Elements are arranged hierarchically or interconnected arbitrarily. Examples: *Trees, Graphs, Hash Maps*.

---

### 1.2 Asymptotic Notations & Performance Analysis
To evaluate algorithms independently of physical hardware speed or compiler optimizations, we measure resource consumption as input size $n \\to \\infty$.

| Notation | Mathematical Definition | Intuitive Meaning |
| :--- | :--- | :--- |
| **Big-O ($O$)** | $0 \\le f(n) \\le c \\cdot g(n)$ for $n \\ge n_0$ | **Upper Bound** (Worst Case Guarantee) |
| **Omega ($\\Omega$)** | $0 \\le c \\cdot g(n) \\le f(n)$ for $n \\ge n_0$ | **Lower Bound** (Best Case Performance) |
| **Theta ($\\Theta$)** | $c_1 \\cdot g(n) \\le f(n) \\le c_2 \\cdot g(n)$ | **Tight Bound** (Exact Asymptotic Order) |

\`\`\`cpp
// Efficient Binary Search Implementation (Time: O(log n), Space: O(1))
int binarySearch(int arr[], int low, int high, int target) {
    while (low <= high) {
        int mid = low + (high - low) / 2; // Prevents integer overflow
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // Element not present
}
\`\`\`

---

### 1.3 2-Dimensional Array Memory Mapping
In computer architecture, RAM is linearly addressed (1-dimensional). A 2D matrix $A[M][N]$ must be serialized into contiguous memory slots:

1. **Row-Major Order (Used in C / C++ / Python):** Consecutive elements of the same row are adjacent in memory.
2. **Column-Major Order (Used in Fortran / MATLAB):** Consecutive elements of the same column are adjacent in memory.
`,
  },
  {
    id: 'ch-2',
    chapterNumber: 2,
    title: 'Unit 2: Stacks, Infix to Postfix & Recursion',
    subtitle: 'LIFO Structure, Expression Evaluation, Tower of Hanoi, and Call Stack Mechanics',
    pagesRange: 'pp. 46 - 98',
    keyTopics: ['LIFO Principle', 'Push, Pop, Peek Operations', 'Infix to Postfix Conversion (Shunting-Yard)', 'Tower of Hanoi Recursion'],
    formulas: [
      'Stack Underflow: top == -1',
      'Stack Overflow: top == MAX_SIZE - 1',
      'Postfix Evaluation: Operand -> Push to stack; Operator -> Pop two, evaluate, push result',
    ],
    examQuestions: [
      'Q1: Convert the Infix expression (A + B) * (C - D) / E to Postfix using Stack tracing table. (AKTU 2023, 7 Marks)',
      'Q2: Solve the Tower of Hanoi problem for n=3 disks with step-by-step state diagrams.',
      'Q3: How does the runtime call stack handle recursive functions? Explain stack frames.',
    ],
    content: `### 2.1 Stack Abstract Data Type (ADT)
A **Stack** is an ordered list where insertions (\`push\`) and deletions (\`pop\`) are restricted strictly to one end called the **Top**.
It functions on the **Last-In, First-Out (LIFO)** principle.

#### Fundamental Operations:
* \`push(x)\`: Adds element $x$ to the top. Throws *Stack Overflow* if capacity is exceeded.
* \`pop()\`: Removes the topmost element and returns it. Throws *Stack Underflow* if stack is empty.
* \`peek()\` / \`top()\`: Inspects current top element without removing it.

\`\`\`cpp
// Array-based Stack ADT with boundary checking
template <typename T, int CAPACITY = 100>
class Stack {
private:
    T data[CAPACITY];
    int topIndex = -1;
public:
    bool push(T val) {
        if (topIndex >= CAPACITY - 1) return false; // Overflow
        data[++topIndex] = val;
        return true;
    }
    bool pop(T &val) {
        if (topIndex < 0) return false; // Underflow
        val = data[topIndex--];
        return true;
    }
    bool isEmpty() const { return topIndex == -1; }
};
\`\`\`

---

### 2.2 Infix to Postfix Algorithm
Computers do not evaluate mathematical expressions with human operator precedence and parentheses. They convert human-readable **Infix** expressions into **Postfix (Reverse Polish Notation)** using Dijkstra's Shunting-Yard technique:

1. Initialize an empty operator stack and an output string.
2. Scan the infix token from left to right:
   * If token is an **operand**, append directly to output.
   * If token is **\`(\`**, push onto stack.
   * If token is **\`)'\**, pop from stack to output until matching \`(\` is popped.
   * If token is an **operator**, pop higher or equal precedence operators from stack to output, then push current operator.
3. At string end, pop all remaining operators from stack to output.
`,
  },
  {
    id: 'ch-3',
    chapterNumber: 3,
    title: 'Unit 3: Queues, Circular Queues & Linked Lists',
    subtitle: 'FIFO Principle, Deque, Priority Queue, Dynamic Memory, Singly and Doubly Linked Lists',
    pagesRange: 'pp. 99 - 162',
    keyTopics: ['FIFO Structure', 'Circular Queue Indexing Modulo', 'Dynamic Node Pointers', 'Cycle Detection in Linked Lists'],
    formulas: [
      'Circular Queue Increment: rear = (rear + 1) % CAPACITY',
      'Circular Queue Full Condition: (rear + 1) % CAPACITY == front',
      'Floyd Tortoise & Hare: slow = slow->next, fast = fast->next->next',
    ],
    examQuestions: [
      'Q1: Explain why simple linear array queues suffer from false overflow. How does a Circular Queue eliminate this? (AKTU 2024)',
      'Q2: Write an algorithm to reverse a Singly Linked List in O(n) time and O(1) auxiliary space.',
      'Q3: Explain Floyd’s Cycle Detection Algorithm for finding loops in linked structures.',
    ],
    content: `### 3.1 Queues & Circular Buffers
A **Queue** is a linear structure based on **First-In, First-Out (FIFO)**. Items enter at the \`rear\` and leave from the \`front\`.

#### The False Overflow Problem:
In a naive linear array queue, after multiple dequeues and enqueues, \`rear\` reaches \`CAPACITY - 1\` even if free slots exist at the front.
**Solution: Circular Queue** using modulo arithmetic:
\`\`\`cpp
void enqueue(int val) {
    if ((rear + 1) % CAPACITY == front) {
        // Queue is Full
        return;
    }
    if (front == -1) front = 0;
    rear = (rear + 1) % CAPACITY;
    queue[rear] = val;
}
\`\`\`

---

### 3.2 Dynamic Singly Linked Lists
Unlike arrays, Linked Lists allocate memory dynamically from the heap on-demand. Nodes are connected via pointers:

\`\`\`cpp
struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

// In-place iterative reversal
Node* reverseList(Node* head) {
    Node *prev = nullptr, *curr = head, *nxt = nullptr;
    while (curr != nullptr) {
        nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev; // New head of reversed list
}
\`\`\`
`,
  },
  {
    id: 'ch-4',
    chapterNumber: 4,
    title: 'Unit 4: Trees, Binary Search Trees & AVL Rotations',
    subtitle: 'Hierarchical Structures, Pre/In/Postorder Traversals, BST Properties & Self-Balancing Trees',
    pagesRange: 'pp. 163 - 230',
    keyTopics: ['Binary Tree Properties', 'Inorder, Preorder, Postorder Traversals', 'BST Search & Deletion', 'AVL Balance Factor & Rotations (LL, RR, LR, RL)'],
    formulas: [
      'Max nodes in binary tree of height h: 2^(h+1) - 1',
      'Height of complete binary tree with n nodes: floor(log2(n))',
      'AVL Balance Factor: BF(node) = Height(LeftSubtree) - Height(RightSubtree)',
      'AVL Invariant: -1 <= BF(node) <= +1 for every node',
    ],
    examQuestions: [
      'Q1: Given Preorder: [A, B, D, E, C, F] and Inorder: [D, B, E, A, F, C], construct the unique binary tree. (AKTU 2025, 7 Marks)',
      'Q2: Insert elements [15, 20, 24, 10, 13, 7, 30, 36, 25] into an initially empty AVL Tree, showing all rotations.',
      'Q3: Discuss deletion in a Binary Search Tree when the node to delete has two children.',
    ],
    content: `### 4.1 Binary Search Tree (BST) Properties
In a Binary Search Tree:
* All values in the **Left Subtree** are strictly smaller than the root value.
* All values in the **Right Subtree** are strictly greater than the root value.
* An **Inorder Traversal** of a valid BST always yields values in ascending sorted order.

---

### 4.2 AVL Self-Balancing Trees
Standard BSTs can degrade to $O(n)$ linear linked chains for presorted inputs. Adelson-Velsky & Landis (AVL) trees maintain balance factor $BF \\in \\{-1, 0, +1\\}$:

#### The 4 Fundamental Rotations:
1. **Left-Left (LL) Heavy:** Single **Right Rotation** around root.
2. **Right-Right (RR) Heavy:** Single **Left Rotation** around root.
3. **Left-Right (LR) Heavy:** Left rotation on left child, then Right rotation on root.
4. **Right-Left (RL) Heavy:** Right rotation on right child, then Left rotation on root.
`,
  },
  {
    id: 'ch-5',
    chapterNumber: 5,
    title: 'Unit 5: Graphs, Minimum Spanning Trees & Shortest Path',
    subtitle: 'Adjacency Representations, BFS/DFS, Kruskal & Prim MST, Dijkstra Shortest Path Algorithm',
    pagesRange: 'pp. 231 - 310',
    keyTopics: ['Adjacency Matrix vs Adjacency List', 'Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Kruskal Algorithm with Disjoint Set', 'Dijkstra Single-Source Shortest Path'],
    formulas: [
      'Edges in Complete Undirected Graph: n * (n - 1) / 2',
      'Dijkstra Time Complexity: O((V + E) log V) with min-priority queue',
      'Kruskal Time Complexity: O(E log E) sorting edges + Union-Find O(E alpha(V))',
    ],
    examQuestions: [
      'Q1: Trace Dijkstra’s algorithm to find the shortest path from source node A to all other nodes. (AKTU 2024, 7 Marks)',
      'Q2: Compare Kruskal vs Prim algorithm for finding Minimum Spanning Tree. Which is better for dense graphs?',
      'Q3: Write recursive DFS algorithm and trace it on a directed graph to detect cycles.',
    ],
    content: `### 5.1 Graph Traversal Foundations
A Graph $G = (V, E)$ consists of vertices and edges connecting them.

* **BFS (Breadth-First Search):** Uses a **Queue**. Traverses level by level like water ripples. Computes shortest path in unweighted graphs. Time: $O(V + E)$.
* **DFS (Depth-First Search):** Uses a **Stack** (or recursion). Explores down each branch before backtracking. Ideal for topological sorting and cycle detection. Time: $O(V + E)$.

---

### 5.2 Dijkstra Shortest Path Algorithm
Finds shortest path from single source vertex to all vertices in a weighted graph with non-negative edge weights:

1. Maintain distance array \`dist[]\` initialized to $\\infty$, with \`dist[src] = 0\`.
2. Insert \`(0, src)\` into a Min-Priority Queue.
3. While queue is not empty:
   * Extract vertex $u$ with minimum distance.
   * For each neighbor $v$ of $u$ with edge weight $w$:
   * If \`dist[u] + w < dist[v]\`, update \`dist[v] = dist[u] + w\` and push \`(dist[v], v)\` to queue.
`,
  },
];

export const DEFAULT_NETWORKS_CHAPTERS: BookChapter[] = [
  {
    id: 'cn-1',
    chapterNumber: 1,
    title: 'Unit 1: Foundations of Computer Networks & Reference Models',
    subtitle: 'Network topologies, OSI 7-Layer vs TCP/IP 4-Layer architecture, physical transmission media',
    pagesRange: 'pp. 1 - 32',
    keyTopics: ['OSI 7 Layers', 'TCP/IP Model', 'Guided vs Unguided Media', 'Packet Switching vs Circuit Switching'],
    formulas: [
      'Total Latency = Transmission Delay + Propagation Delay + Queuing Delay + Processing Delay',
      'Transmission Delay = Packet Size (L) / Bandwidth (B)',
      'Propagation Delay = Distance (d) / Propagation Speed (s)',
    ],
    examQuestions: [
      'Q1: Compare the 7-Layer OSI model with the 4-Layer TCP/IP protocol stack. (AKTU 2024, 7 Marks)',
      'Q2: Calculate propagation delay and transmission delay for a 10MB packet over a 1 Gbps link of 2000 km.',
    ],
    content: `### 1.1 The OSI 7-Layer Reference Model
1. **Physical Layer:** Bits transmission across physical media (voltage, cables, radio).
2. **Data Link Layer:** Reliable node-to-node frame transfer, MAC addressing, error detection (CRC).
3. **Network Layer:** Logical end-to-end packet delivery, IP addressing, routing (OSPF, BGP).
4. **Transport Layer:** Process-to-process communication, port numbers, reliability, flow and congestion control (TCP, UDP).
5. **Session Layer:** Session establishment, checkpointing, token management.
6. **Presentation Layer:** Syntax translation, encryption (TLS/SSL), compression.
7. **Application Layer:** Network user services (HTTP, DNS, SMTP, FTP).
`,
  },
  {
    id: 'cn-2',
    chapterNumber: 2,
    title: 'Unit 2: Data Link Layer, Framing & Sliding Window Protocols',
    subtitle: 'Bit & byte stuffing, CRC error checking, Stop-and-Wait, Go-Back-N, Selective Repeat ARQ',
    pagesRange: 'pp. 33 - 68',
    keyTopics: ['Framing Techniques', 'CRC Polynomial Division', 'Stop-and-Wait ARQ', 'Go-Back-N vs Selective Repeat'],
    formulas: [
      'Efficiency of Stop-and-Wait: eta = 1 / (1 + 2a), where a = Tprop / Ttrans',
      'Efficiency of Go-Back-N: eta = N / (1 + 2a) with sender window N',
      'Window Size Invariant (Selective Repeat): Sender Window + Receiver Window <= 2^m',
    ],
    examQuestions: [
      'Q1: Derive the throughput and channel utilization efficiency of Go-Back-N protocol. (AKTU 2023)',
      'Q2: Generate the CRC transmitted codeword for data 1101011011 with generator polynomial x^4 + x + 1.',
    ],
    content: `### 2.1 Sliding Window Protocols
In computer networks, sliding window protocols enable full-duplex data transfer while handling packet loss and propagation delays:

* **Stop-and-Wait:** Sender transmits 1 frame, freezes and waits for ACK before sending next. Very low channel efficiency when propagation delay is high.
* **Go-Back-N (GBN):** Sender window size $N > 1$, receiver window size $= 1$. If frame $k$ is lost, receiver discards all subsequent frames; sender re-transmits all $N$ frames starting from $k$.
* **Selective Repeat (SR):** Sender window $N$, receiver window $N$. Receiver buffers out-of-order valid frames. Sender retransmits strictly the missing frame.
`,
  },
  {
    id: 'cn-3',
    chapterNumber: 3,
    title: 'Unit 3: Medium Access Sublayer & Local Area Networks',
    subtitle: 'ALOHA, CSMA/CD, CSMA/CA, Ethernet frames, collision detection and backoff',
    pagesRange: 'pp. 69 - 95',
    keyTopics: ['Pure ALOHA vs Slotted ALOHA', 'CSMA/CD Mechanism', 'Binary Exponential Backoff', 'Ethernet 802.3'],
    formulas: [
      'Pure ALOHA Max Throughput: S = G * e^(-2G) = 1 / (2e) approx 18.4%',
      'Slotted ALOHA Max Throughput: S = G * e^(-G) = 1 / e approx 36.8%',
      'CSMA/CD Minimum Frame Size: Frame Size >= 2 * Tprop * Bandwidth',
    ],
    examQuestions: [
      'Q1: Explain why minimum frame size is mandated in CSMA/CD Ethernet. Derive the relation. (AKTU 2025)',
      'Q2: Explain the Binary Exponential Backoff algorithm used in Ethernet collisions.',
    ],
    content: `### 3.1 CSMA/CD (Carrier Sense Multiple Access with Collision Detection)
Nodes listen to the channel before transmitting:
1. If channel is busy, wait.
2. If channel is idle, start transmitting while continuing to monitor signal levels.
3. If two stations transmit simultaneously, collision occurs (voltage anomaly detected).
4. Stations immediately abort transmission, broadcast a 32-bit **jamming signal**, and initiate **Binary Exponential Backoff**:
   * Wait $k \\times 51.2\\mu s$, where $k \\in [0, 2^i - 1]$ for collision attempt $i$.
`,
  },
  {
    id: 'cn-4',
    chapterNumber: 4,
    title: 'Unit 4: Network Layer, IP Addressing & Subnetting',
    subtitle: 'IPv4 header, CIDR prefix matching, ARP, ICMP, Distance Vector & Link State Routing',
    pagesRange: 'pp. 96 - 135',
    keyTopics: ['IPv4 Addressing & Classes', 'CIDR Subnet Masking', 'ARP Protocol', 'Dijkstra Link-State (OSPF)', 'Bellman-Ford (RIP)'],
    formulas: [
      'Subnet Usable Hosts: 2^(32 - prefix) - 2 (subtracting Network ID and Directed Broadcast)',
      'Bellman-Ford Distance Equation: D_x(y) = min_v { c(x, v) + D_v(y) }',
    ],
    examQuestions: [
      'Q1: An organization is granted block 198.16.0.0/16. Design 4 equal-sized subnets and list their Subnet Masks, Range, and Broadcast addresses. (AKTU 2024)',
      'Q2: Compare Distance Vector Routing vs Link State Routing. Explain the Count-to-Infinity problem.',
    ],
    content: `### 4.1 Subnetting & CIDR (Classless Inter-Domain Routing)
CIDR notation specifies the number of fixed network bits in a slash prefix (e.g. \`192.168.1.0/24\` means 24 network bits, 8 host bits).

#### Subnet Design Example:
Dividing \`192.168.10.0/24\` into 4 equal departments:
* Needed subnets = 4 ($2^2 = 4$). We borrow 2 bits from host section.
* New subnet mask = $/24 + 2 = /26$ (\`255.255.255.192\`).
* Block size per subnet = $256 - 192 = 64$ addresses ($62$ usable per subnet).
`,
  },
  {
    id: 'cn-5',
    chapterNumber: 5,
    title: 'Unit 5: Transport Layer & TCP Congestion Control',
    subtitle: 'TCP 3-Way Handshake, TCP vs UDP, TCP Sliding Window, Tahoe & Reno Congestion Mechanics',
    pagesRange: 'pp. 136 - 170',
    keyTopics: ['TCP 3-Way Handshake', '4-Way Connection Teardown', 'TCP Slow Start & Congestion Avoidance', 'Fast Retransmit & Fast Recovery'],
    formulas: [
      'Slow Start Window Growth: cwnd = cwnd + 1 MSS per received ACK (Exponential doubling)',
      'Congestion Avoidance Growth: cwnd = cwnd + (1 / cwnd) per ACK (Additive Increase)',
      'Timeout Multiplicative Decrease: ssthresh = cwnd / 2, cwnd = 1 MSS',
    ],
    examQuestions: [
      'Q1: Draw the full sequence diagram for TCP 3-Way Handshake connection establishment with sequence numbers. (AKTU 2025, 7 Marks)',
      'Q2: Explain TCP Tahoe vs TCP Reno congestion control phases with a clear cwnd vs time plot.',
    ],
    content: `### 5.1 TCP 3-Way Handshake
1. **Step 1 (SYN):** Client sends SYN with initial sequence number $ISN_C$.
2. **Step 2 (SYN + ACK):** Server responds with SYN with its own $ISN_S$, and ACK $= ISN_C + 1$.
3. **Step 3 (ACK):** Client sends ACK $= ISN_S + 1$. Connection is now ESTABLISHED!

### 5.2 TCP Congestion Control
* **Slow Start:** Starts with $cwnd = 1$. Doubles every RTT until $cwnd \\ge ssthresh$.
* **Congestion Avoidance:** Grows linearly ($+1$ MSS per RTT).
* **Triple Duplicate ACK (Loss):** Indicates minor packet loss. TCP Reno cuts $cwnd$ in half and enters Fast Recovery without dropping back to 1.
`,
  },
];

export const DEFAULT_DBMS_CHAPTERS: BookChapter[] = [
  {
    id: 'db-1',
    chapterNumber: 1,
    title: 'Unit 1: ER Modeling & Relational Architecture',
    subtitle: '3-Schema Architecture, Entity Sets, Weak Entities, Mapping Cardinalities to Relations',
    pagesRange: 'pp. 1 - 40',
    keyTopics: ['Physical, Logical, View Schema', 'ER Diagrams', 'Candidate Keys & Primary Keys', 'ER to Relational Schema Mapping'],
    formulas: [
      'Weak Entity Primary Key: Partial Discriminator + Owner Entity Primary Key',
      'Cardinality Ratios: 1:1, 1:N, N:M',
    ],
    examQuestions: [
      'Q1: Draw an ER diagram for a University Management System showing entities, relationships, and constraints. (AKTU 2024)',
      'Q2: Explain Physical vs Logical Data Independence with practical examples.',
    ],
    content: `### 1.1 Three-Schema Database Architecture
1. **Internal / Physical Level:** Describes low-level physical storage structures (B+ trees, page layout, hashing).
2. **Conceptual / Logical Level:** Describes what data is stored in the database, relationships, and integrity constraints without physical implementation details.
3. **External / View Level:** User-customized views preventing unauthorized access to raw tables.
`,
  },
  {
    id: 'db-2',
    chapterNumber: 2,
    title: 'Unit 2: Relational Algebra & Advanced SQL',
    subtitle: 'Selection, Projection, Cartesian Product, Natural Join, Division, Group By and Subqueries',
    pagesRange: 'pp. 41 - 85',
    keyTopics: ['Fundamental Relational Algebra Operators', 'Theta Join & Outer Joins', 'Relational Division (÷)', 'Nested SQL Subqueries'],
    formulas: [
      'Selection: sigma_{condition}(Relation)',
      'Projection: pi_{attribute_list}(Relation)',
      'Natural Join: R bowtie S',
      'Relational Division: R / S (Find all entities matching all items)',
    ],
    examQuestions: [
      'Q1: Write Relational Algebra expressions and SQL queries for finding employees earning more than their department average.',
      'Q2: Explain Relational Division operator with a clear real-world tabular demonstration.',
    ],
    content: `### 2.1 Core Relational Algebra Operators
* $\\sigma_{\\text{dept} = 'CSE'}(Student)$: Filters tuples meeting condition.
* $\\pi_{rollNo, name}(Student)$: Extracts specific columns.
* $R \\times S$: Cartesian product pairing every tuple of $R$ with every tuple of $S$.
* $R \\bowtie S$: Natural join combining rows where shared attribute names match.
`,
  },
  {
    id: 'db-3',
    chapterNumber: 3,
    title: 'Unit 3: Normalization & Functional Dependencies',
    subtitle: 'Armstrong Axioms, Closure of Attributes, Canonical Cover, 1NF, 2NF, 3NF, BCNF',
    pagesRange: 'pp. 86 - 130',
    keyTopics: ['Functional Dependencies', 'Armstrong Axioms', '1NF, 2NF, 3NF Definitions', 'Boyce-Codd Normal Form (BCNF)', 'Lossless Join Decomposition'],
    formulas: [
      'Armstrong Reflexivity: If Y subset of X, then X -> Y',
      'Armstrong Augmentation: If X -> Y, then XZ -> YZ',
      'Armstrong Transitivity: If X -> Y and Y -> Z, then X -> Z',
      'BCNF Rule: For every non-trivial FD X -> Y, X MUST be a superkey of R',
    ],
    examQuestions: [
      'Q1: Given R(A, B, C, D, E) with FDs {A -> BC, CD -> E, B -> D, E -> A}. Find candidate keys and decompose into BCNF.',
      'Q2: State and prove the conditions required for a decomposition to be both Lossless and Dependency Preserving.',
    ],
    content: `### 3.1 Normal Forms Hierarchy
* **1NF:** All attribute values must be atomic (no arrays or multi-valued attributes).
* **2NF:** In 1NF and no non-prime attribute is partially dependent on any candidate key.
* **3NF:** In 2NF and for every FD $X \\to Y$, either $X$ is a superkey OR $Y$ is a prime attribute (eliminates transitive dependencies).
* **BCNF:** For every FD $X \\to Y$, $X$ must strictly be a superkey.
`,
  },
  {
    id: 'db-4',
    chapterNumber: 4,
    title: 'Unit 4: Transaction Processing & Concurrency Control',
    subtitle: 'ACID Properties, Serializability, Precedence Graphs, 2-Phase Locking (2PL), Deadlock',
    pagesRange: 'pp. 131 - 175',
    keyTopics: ['ACID Properties', 'Conflict Serializability', 'Precedence (Serialization) Graph', 'Strict Two-Phase Locking (2PL)', 'Timestamp Ordering'],
    formulas: [
      'Conflict Condition: 2 operations belong to different transactions, access same data item, and at least ONE is a WRITE',
      '2PL Invariant: Once a transaction releases a lock, it CANNOT acquire any new lock',
    ],
    examQuestions: [
      'Q1: Test whether schedule S is Conflict Serializable using Precedence Graph cycle detection. (AKTU 2024, 7 Marks)',
      'Q2: How does Strict 2PL prevent cascading aborts? Explain Growing and Shrinking phases.',
    ],
    content: `### 4.1 ACID Properties
* **Atomicity:** All operations succeed or entire transaction is rolled back.
* **Consistency:** Transaction preserves all database constraints.
* **Isolation:** Intermediate states are hidden from concurrent transactions.
* **Durability:** Committed changes persist across system crashes.
`,
  },
  {
    id: 'db-5',
    chapterNumber: 5,
    title: 'Unit 5: Storage Structures, Indexing & B+ Trees',
    subtitle: 'Primary vs Secondary Index, Dense vs Sparse, B-Tree and B+ Tree structures and search algorithms',
    pagesRange: 'pp. 176 - 210',
    keyTopics: ['File Organization', 'Dense vs Sparse Index', 'B-Tree Node Structure', 'B+ Tree Leaf Pointers & Range Scans'],
    formulas: [
      'B+ Tree Fan-out: Maximum keys per node = m - 1, Maximum child pointers = m',
      'Search Cost: O(log_m(N)) disk block I/Os',
    ],
    examQuestions: [
      'Q1: Explain the internal structure of a B+ Tree. Why are leaves linked sequentially? (AKTU 2025)',
      'Q2: Insert records into an initially empty B+ Tree of order 4 showing node splits.',
    ],
    content: `### 5.1 Why B+ Trees are King in Databases
* Internal nodes store **only search keys and router pointers**, maximizing fan-out so tree height remains low (usually 3 or 4 levels for millions of rows).
* Leaf nodes contain all actual data pointers and are chained in a **bidirectional linked list**, making SQL range scans (\`BETWEEN\`, \`>\`, \`<\`) lightning-fast.
`,
  },
];

export const DEFAULT_OS_CHAPTERS: BookChapter[] = [
  {
    id: 'os-1',
    chapterNumber: 1,
    title: 'Unit 1: OS Kernel Services, System Calls & Process Lifecycle',
    subtitle: 'Process Control Block (PCB), Dual-Mode Operation, Context Switching and Forking',
    pagesRange: 'pp. 1 - 58',
    keyTopics: ['Dual-Mode (User/Kernel)', 'System Calls Mechanism', 'Process States & PCB', 'Context Switch Overhead', 'fork() & exec()'],
    formulas: [
      'Context Switch Overhead: Time = T_save_regs + T_flush_cache + T_load_regs',
      'Child Processes Created by n fork() calls: Total Processes = 2^n',
    ],
    examQuestions: [
      'Q1: Explain the step-by-step mechanism of a System Call using trap instruction and mode bit change. (AKTU 2024, 7 Marks)',
      'Q2: What information is stored in a Process Control Block (PCB)? Draw the 5-state process model.',
      'Q3: How many times will "Campus" be printed by: for(int i=0; i<3; i++) fork(); printf("Campus\\n");?',
    ],
    content: `### 1.1 Dual-Mode Operation and System Protection
To protect the operating system from errant user programs and malicious intrusions, modern CPUs provide at least two architectural execution modes:
* **User Mode (Mode bit = 1):** Unprivileged instructions only; direct hardware I/O instructions are trapped.
* **Kernel Mode (Supervisor/Privileged Mode, Mode bit = 0):** CPU can execute any machine instruction and access privileged kernel data structures.

When a user application requires operating system services (such as file I/O \`read()\`, \`write()\`, or memory allocation \`sbrk()\`), it triggers a software interrupt (trap/exception). The hardware automatically switches the mode bit to 0, loads the kernel interrupt vector handler, validates arguments, and executes the system call before returning execution back to user space.

---

### 1.2 The Process Control Block (PCB)
Each executing process is represented in the operating system kernel by a **Process Control Block (PCB)**, which encapsulates:
1. **Process ID (PID)** and Parent Process ID (PPID)
2. **Process State:** New, Ready, Running, Waiting, Terminated
3. **Program Counter (PC):** Address of the next CPU instruction
4. **CPU Registers:** Accumulator, index registers, stack pointers, condition codes
5. **Memory Management Information:** Page tables or segment descriptors
6. **Accounting Information:** CPU time consumed, time limits, scheduling priority
7. **I/O Status Information:** List of open file descriptors and allocated devices
`,
  },
  {
    id: 'os-2',
    chapterNumber: 2,
    title: 'Unit 2: CPU Scheduling Algorithms & Preemption',
    subtitle: 'FCFS, SJF, SRTF, Priority, Round Robin, and Multi-Level Feedback Queues',
    pagesRange: 'pp. 59 - 118',
    keyTopics: ['Turnaround & Waiting Time', 'Convoy Effect in FCFS', 'SJF Minimality Proof', 'Round Robin Quantum Tuning'],
    formulas: [
      'Turnaround Time (TAT) = Completion Time - Arrival Time',
      'Waiting Time (WT) = Turnaround Time - Burst Time',
      'Exponential Smoothing for Next Burst: τ_{n+1} = α * t_n + (1 - α) * τ_n',
    ],
    examQuestions: [
      'Q1: Given 5 processes with arrival and burst times, draw Gantt charts and compute average WT for SJF and Round Robin (q=2). (AKTU 2024)',
      'Q2: Why does SJF provide the minimum theoretical average waiting time? Prove mathematically.',
      'Q3: Explain the Convoy Effect in FCFS scheduling and how Round Robin eliminates it.',
    ],
    content: `### 2.1 Scheduling Criteria & Metrics
* **CPU Utilization:** Percentage of time the CPU is actively executing tasks (target: 40% to 90%).
* **Throughput:** Number of completed processes per unit time.
* **Turnaround Time:** Interval from process submission to process termination.
* **Waiting Time:** Total time a process spends waiting inside the Ready Queue.
* **Response Time:** Time elapsed from job submission to the very first response generated.

### 2.2 Shortest Job First (SJF) vs Round Robin (RR)
* **SJF (Shortest Job First):** Provably optimal in minimizing average waiting time. However, it cannot be implemented natively in general-purpose operating systems because future CPU burst length $t_n$ is unknown ahead of time.
* **Round Robin (RR):** Preemptive scheduling designed specifically for time-sharing interactive systems. If the time quantum $q$ is exceptionally large, RR degenerates into FCFS. If $q$ is too small, context-switching overhead dominates CPU runtime. Ideal standard: 80% of CPU bursts should be shorter than $q$.
`,
  },
  {
    id: 'os-3',
    chapterNumber: 3,
    title: 'Unit 3: Process Synchronization, Critical Section & Semaphores',
    subtitle: 'Mutual Exclusion, Progress, Bounded Waiting, Peterson Algorithm, Mutex, and Classical IPC',
    pagesRange: 'pp. 119 - 182',
    keyTopics: ['Critical Section Problem', 'Peterson Solution Proof', 'TestAndSet & Swap Hardware Instructions', 'Counting Semaphores', 'Producer-Consumer Bounded Buffer'],
    formulas: [
      'wait(S): while (S <= 0); S = S - 1;',
      'signal(S): S = S + 1;',
    ],
    examQuestions: [
      'Q1: Define Critical Section problem and prove Peterson algorithm satisfies all 3 criteria. (AKTU 2024)',
      'Q2: Solve the Producer-Consumer problem using Semaphores. Explain role of mutex, empty, full.',
      'Q3: Explain Dining Philosophers problem and provide a deadlock-free synchronization solution.',
    ],
    content: `### 3.1 The Critical Section Problem
When concurrent processes access shared memory or files, inconsistent results occur unless critical regions are synchronized. A valid solution must satisfy three criteria:
1. **Mutual Exclusion:** If process $P_i$ is executing in its critical section, no other processes can be executing in their critical sections.
2. **Progress:** If no process is in its critical section and some wish to enter, selection cannot be postponed indefinitely by processes executing outside.
3. **Bounded Waiting:** A bound must exist on the number of times other processes are allowed to enter their critical sections after a process has requested entry.

### 3.2 Semaphore Synchronization
A **Semaphore** $S$ is an integer variable accessed solely through two atomic primitive operations:
\`\`\`c
// Producer Consumer Solution
semaphore mutex = 1; // Controls access to buffer
semaphore empty = N; // Counts free buffer slots
semaphore full  = 0; // Counts filled buffer slots

void producer() {
    while (1) {
        item = produce_item();
        wait(empty);
        wait(mutex);
        insert_item(item);
        signal(mutex);
        signal(full);
    }
}
\`\`\`
`,
  },
  {
    id: 'os-4',
    chapterNumber: 4,
    title: 'Unit 4: Deadlocks: Characterization, Banker Algorithm & Recovery',
    subtitle: 'Resource-Allocation Graphs, 4 Coffman Conditions, Safety Algorithm, and Deadlock Detection',
    pagesRange: 'pp. 183 - 230',
    keyTopics: ['4 Coffman Conditions', 'Resource Allocation Graph', 'Banker Algorithm for Avoidance', 'Safety Test', 'Deadlock Detection vs Prevention'],
    formulas: [
      'Need Matrix: Need[i][j] = Max[i][j] - Allocation[i][j]',
      'Safety Condition: Work = Available; if Need[i] <= Work then Work = Work + Allocation[i]',
    ],
    examQuestions: [
      'Q1: State 4 necessary conditions for Deadlock. Explain how preventing Circular Wait eliminates deadlock. (AKTU 2024)',
      'Q2: Apply Banker Algorithm on given system state to test if it is in a Safe State and find the safe execution sequence.',
    ],
    content: `### 4.1 The Four Necessary Conditions (Coffman Conditions)
A deadlock can occur if and only if all four conditions hold simultaneously:
1. **Mutual Exclusion:** At least one resource must be held in a non-shareable mode.
2. **Hold and Wait:** A process must be holding at least one resource and waiting to acquire additional resources held by others.
3. **No Preemption:** Resources cannot be forcibly preempted; only released voluntarily by the holding process.
4. **Circular Wait:** A closed chain of processes $\{P_0, P_1, \dots, P_n\}$ exists such that $P_0$ waits for resource held by $P_1$, and $P_n$ waits for $P_0$.
`,
  },
  {
    id: 'os-5',
    chapterNumber: 5,
    title: 'Unit 5: Memory Management, Paging, TLB & Page Replacement',
    subtitle: 'Virtual Memory, Address Translation, Effective Memory Access Time (EMAT), FIFO, LRU, Optimal',
    pagesRange: 'pp. 231 - 290',
    keyTopics: ['Virtual Address Translation', 'Paging & Page Tables', 'TLB Hit Ratio & EMAT', 'Page Fault Handler', 'Belady Anomaly in FIFO'],
    formulas: [
      'EMAT = Hit_Ratio * (TLB + RAM) + (1 - Hit_Ratio) * (TLB + 2 * RAM)',
      'Logical Address = (Page Number p, Offset d)',
    ],
    examQuestions: [
      'Q1: Calculate EMAT for a paging system with 95% TLB hit ratio, 10ns TLB lookup, 100ns memory access. (AKTU 2024)',
      'Q2: Compare FIFO, LRU, and Optimal page replacement algorithms for a reference string with 3 frames.',
      'Q3: What is Thrashing? Explain Working Set Model and how it prevents thrashing.',
    ],
    content: `### 5.1 Paging and Address Translation
Paging is a memory-management scheme that permits the physical address space of a process to be noncontiguous.
* Physical memory is divided into fixed-sized blocks called **Frames**.
* Logical address space is divided into blocks of the same size called **Pages**.
Every logical address generated by the CPU consists of two parts:
* **Page Number ($p$):** Used as an index into a per-process Page Table containing the base address of each physical frame.
* **Page Offset ($d$):** Combined with the base address to define the physical memory location accessed.
`,
  },
];

export const DEFAULT_DISCRETE_MATH_CHAPTERS: BookChapter[] = [
  {
    id: 'dm-1',
    chapterNumber: 1,
    title: 'Unit 1: Propositional & Predicate Logic, Equivalences & Quantifiers',
    subtitle: 'Truth Tables, Tautology, De Morgan Laws, Universal/Existential Quantifiers and Proof Methods',
    pagesRange: 'pp. 1 - 48',
    keyTopics: ['Truth Tables', 'Tautologies & Contradictions', 'Logical Equivalences', 'Predicates & Quantifiers', 'Direct Proof & Proof by Contradiction'],
    formulas: [
      'Conditional Equivalence: p -> q ≡ ¬p ∨ q',
      'De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q; ¬(p ∨ q) ≡ ¬p ∧ ¬q',
      'Contrapositive: p -> q ≡ ¬q -> ¬p',
    ],
    examQuestions: [
      'Q1: Prove that [(p -> q) ∧ (q -> r)] -> (p -> r) is a Tautology. (AKTU 2024, 7 Marks)',
      'Q2: State and prove De Morgan Laws for propositions using truth tables.',
      'Q3: Express the following using quantifiers: "Every computer science student has taken at least one programming course."',
    ],
    content: `### 1.1 Propositional Logic Foundations
A **proposition** is a declarative statement that is either true ($T$ or $1$) or false ($F$ or $0$), but not both.
* **Negation ($\neg p$):** Not $p$.
* **Conjunction ($p \wedge q$):** True strictly when both $p$ and $q$ are true.
* **Disjunction ($p \vee q$):** True when at least one operand is true.
* **Implication ($p \to q$):** False strictly when hypothesis $p$ is true and conclusion $q$ is false. Notice $p \to q \equiv \neg p \vee q$.
* **Biconditional ($p \leftrightarrow q$):** True when $p$ and $q$ possess identical truth values.
`,
  },
  {
    id: 'dm-2',
    chapterNumber: 2,
    title: 'Unit 2: Relations, Equivalence Classes, Posets & Hasse Diagrams',
    subtitle: 'Reflexive, Symmetric, Transitive Relations, Equivalence Relations, Partial Orders and Lattices',
    pagesRange: 'pp. 49 - 96',
    keyTopics: ['Relation Properties', 'Equivalence Classes & Partitions', 'Partial Ordering Relations (Posets)', 'Hasse Diagrams', 'Lattices & Boolean Algebra'],
    formulas: [
      'Equivalence Relation: Reflexive + Symmetric + Transitive',
      'Partial Order (Poset): Reflexive + Anti-Symmetric + Transitive',
    ],
    examQuestions: [
      'Q1: Let R be defined on Z by (a, b) in R iff a ≡ b (mod 5). Prove R is an equivalence relation and determine all classes. (AKTU 2024)',
      'Q2: Draw the Hasse diagram for the poset (D_36, |) where D_36 is the set of positive divisors of 36.',
      'Q3: Define a Lattice. Prove that every chain is a distributive lattice.',
    ],
    content: `### 2.1 Equivalence Relations and Partitions
A binary relation $R$ on set $A$ is an **Equivalence Relation** if and only if it satisfies:
1. **Reflexive:** $\forall a \in A, (a, a) \in R$
2. **Symmetric:** $\forall a, b \in A, (a, b) \in R \implies (b, a) \in R$
3. **Transitive:** $\forall a, b, c \in A, (a, b) \in R \wedge (b, c) \in R \implies (a, c) \in R$

Every equivalence relation on $A$ partitions $A$ into mutually disjoint subsets called **Equivalence Classes** $[a] = \{x \in A \mid (a, x) \in R\}$.
`,
  },
  {
    id: 'dm-3',
    chapterNumber: 3,
    title: 'Unit 3: Mathematical Induction, Combinatorics & Recurrence Relations',
    subtitle: 'Weak & Strong Induction, Pigeonhole Principle, Permutations, Linear Recurrence Solving',
    pagesRange: 'pp. 97 - 148',
    keyTopics: ['Mathematical Induction', 'Pigeonhole Principle', 'Characteristic Equations', 'Generating Functions'],
    formulas: [
      'Pigeonhole Principle: If k objects placed into n boxes, at least one box contains ⌈k/n⌉ objects',
      'Second Order Recurrence: a_n = C1*(r1^n) + C2*(r2^n)',
    ],
    examQuestions: [
      'Q1: Prove by induction: 1^2 + 2^2 + ... + n^2 = [n(n+1)(2n+1)]/6. (AKTU 2024)',
      'Q2: Solve recurrence: a_n - 7a_{n-1} + 10a_{n-2} = 0 with a_0 = 1, a_1 = 8.',
    ],
    content: `### 3.1 Principle of Mathematical Induction
To prove that $P(n)$ is true for all integers $n \ge 1$:
1. **Base Step:** Verify that $P(1)$ is true.
2. **Inductive Hypothesis:** Assume that $P(k)$ is true for an arbitrary integer $k \ge 1$.
3. **Inductive Step:** Prove that $P(k+1)$ is true under the hypothesis that $P(k)$ holds.
Conclude that $P(n)$ is true for all $n \ge 1$.
`,
  },
  {
    id: 'dm-4',
    chapterNumber: 4,
    title: 'Unit 4: Graph Theory: Paths, Cycles, Euler & Hamiltonian Graphs',
    subtitle: 'Handshaking Lemma, Isomorphism, Planar Graphs, Euler Formula, Graph Coloring',
    pagesRange: 'pp. 149 - 210',
    keyTopics: ['Handshaking Lemma', 'Euler Circuits', 'Hamiltonian Cycles', 'Planar Graphs (Euler Formula v - e + f = 2)', 'Chromatic Number'],
    formulas: [
      'Handshaking Lemma: ∑ deg(v) = 2 * |E|',
      'Euler Formula for Connected Planar Graphs: V - E + R = 2',
    ],
    examQuestions: [
      'Q1: State and prove the Handshaking Lemma. Prove that an undirected graph has an even number of odd-degree vertices.',
      'Q2: State necessary and sufficient conditions for an Euler circuit in a connected graph.',
    ],
    content: `### 4.1 Handshaking Lemma & Degree Properties
In every undirected graph $G = (V, E)$, the sum of degrees of all vertices equals twice the number of edges:
$$\\sum_{v \\in V} \\text{deg}(v) = 2|E|$$
**Corollary:** Every undirected graph contains an even number of vertices with odd degree.
`,
  },
];

/**
 * Returns complete curriculum chapters for any study resource.
 */
export function getChaptersForResource(resource: StudyResource): BookChapter[] {
  if (resource.chapters && resource.chapters.length > 0) {
    return resource.chapters;
  }

  const titleLower = (resource.title + ' ' + resource.subject).toLowerCase();

  if (titleLower.includes('network') || titleLower.includes('osi') || titleLower.includes('tcp') || titleLower.includes('kurose')) {
    return DEFAULT_NETWORKS_CHAPTERS;
  }
  if (titleLower.includes('dbms') || titleLower.includes('database') || titleLower.includes('sql') || titleLower.includes('korth')) {
    return DEFAULT_DBMS_CHAPTERS;
  }
  if (titleLower.includes('operating system') || titleLower.includes('galvin') || titleLower.includes('kernel') || titleLower.includes('scheduling')) {
    return DEFAULT_OS_CHAPTERS;
  }
  if (titleLower.includes('discrete') || titleLower.includes('rosen') || titleLower.includes('logic') || titleLower.includes('graph theory')) {
    return DEFAULT_DISCRETE_MATH_CHAPTERS;
  }
  // Default to Data Structures & Algorithms
  return DEFAULT_DSA_CHAPTERS;
}

/**
 * Builds an authentic academic PDF document using jsPDF.
 */
export function buildResourcePdfDoc(resource: StudyResource, chapterIndex = 0): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const chapters = getChaptersForResource(resource);
  const primaryChapter = chapters[chapterIndex] || chapters[0];

  // Page 1: Academic Title Page & Executive Summary
  // Header banner
  doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 42, 'F');

    doc.setTextColor(56, 189, 248); // cyan-400
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('CAMPUSHUB ACADEMIC REPOSITORY • BBDITM LUCKNOW', 14, 15);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    const splitTitle = doc.splitTextToSize(resource.title, 180);
    doc.text(splitTitle, 14, 25);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `Course: ${resource.course} | Subject: ${resource.subject} | Sem: ${resource.semester} | Author: ${resource.author}`,
      14,
      36
    );

    // Meta Box
    let y = 52;
    doc.setFillColor(241, 245, 249); // slate-100
    doc.roundedRect(14, y, 182, 28, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, y, 182, 28, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('DOCUMENT SUMMARY & ACADEMIC FAIR-USE NOTICE', 20, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const descLines = doc.splitTextToSize(resource.description, 170);
    doc.text(descLines.slice(0, 2), 20, y + 16);
    doc.text(`Official Format: ${resource.category} • File Size: ${resource.fileSize || '12.4 MB'} • Verified Academic Copy`, 20, y + 24);

    y += 36;

    // Syllabus Units Table of Contents
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('CURRICULUM SYLLABUS & UNIT BREAKDOWN', 14, y);
    y += 6;

    const units = resource.unitsSummary || chapters.map((c) => `Unit ${c.chapterNumber}: ${c.title}`);
    units.forEach((unit, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 252 : 255);
      doc.rect(14, y - 4, 182, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(2, 132, 199);
      doc.text(`• Unit ${idx + 1}:`, 16, y + 1.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const unitText = doc.splitTextToSize(unit.replace(/^Unit \d+:?\s*/i, ''), 150);
      doc.text(unitText[0] || unit, 35, y + 1.5);
      y += 8.5;
    });

    y += 6;

    // Primary Unit Study Content
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(14, 116, 144);
    doc.text(primaryChapter.title.toUpperCase(), 14, y);
    y += 6;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(primaryChapter.subtitle || '', 14, y);
    y += 7;

    // Key Topics Chips
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Key Focus Areas:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(primaryChapter.keyTopics.join('  •  '), 42, y);
    y += 8;

    // Formulas & High-Frequency Exam Insights
    if (primaryChapter.formulas && primaryChapter.formulas.length > 0) {
      doc.setFillColor(254, 243, 199); // amber-100
      doc.roundedRect(14, y, 182, 22, 1.5, 1.5, 'F');
      doc.setDrawColor(245, 158, 11);
      doc.roundedRect(14, y, 182, 22, 1.5, 1.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(180, 83, 9);
      doc.text('EXAM CHEAT-SHEET FORMULAS & INVARIANTS', 18, y + 6);

      doc.setFont('courier', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 53, 15);
      primaryChapter.formulas.slice(0, 2).forEach((f, i) => {
        doc.text(f, 18, y + 12 + i * 5);
      });
      y += 28;
    }

    // High frequency university questions
    if (primaryChapter.examQuestions && primaryChapter.examQuestions.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('UNIVERSITY HIGH-FREQUENCY EXAM QUESTIONS:', 14, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      primaryChapter.examQuestions.forEach((q) => {
        const qLines = doc.splitTextToSize(`* ${q}`, 180);
        doc.text(qLines, 14, y);
        y += qLines.length * 4;
      });
    }

    // Footer page 1
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('CampusHub Digital Library • Powered by Google AI Studio • Page 1 of 2', 14, 288);
    doc.text('Authorized for personal study use only', 150, 288);

    // Page 2: Detailed Chapter Text, Algorithms & Proofs
    doc.addPage();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 18, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`${resource.title} — ${primaryChapter.title}`, 14, 11);
    doc.setTextColor(56, 189, 248);
    doc.text(`Page 2 of 2`, 185, 11);

    let p2y = 28;

    // Clean markdown text for PDF display
    const rawContent = primaryChapter.content
      .replace(/###\s+/g, '\n\n')
      .replace(/####\s+/g, '\n')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/```[a-z]*\n/g, '')
      .replace(/```/g, '')
      .replace(/\$/g, '');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);

    const contentLines = doc.splitTextToSize(rawContent, 182);
    const pageLines = contentLines.slice(0, 56);
    doc.text(pageLines, 14, p2y);

    // Footer page 2
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('CampusHub Digital Library • BBDITM Academic Repository', 14, 288);
    doc.text('End of Authorized Sample Material', 145, 288);

    return doc;
}

/**
 * Downloads the resource as an academic PDF document.
 */
export function downloadResourcePdf(resource: StudyResource, chapterIndex = 0): boolean {
  try {
    if (resource.pdfBlobUrl) {
      const a = document.createElement('a');
      a.href = resource.pdfBlobUrl;
      const safeTitle = resource.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 36);
      a.download = `${safeTitle}_CampusHub.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return true;
    }
    const doc = buildResourcePdfDoc(resource, chapterIndex);
    const safeTitle = resource.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 36);
    doc.save(`${safeTitle}_CampusHub.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}

/**
 * Generates an in-memory Blob URL for previewing the PDF directly in the app.
 */
export function generatePdfBlobUrl(resource: StudyResource, chapterIndex = 0): string | null {
  try {
    const doc = buildResourcePdfDoc(resource, chapterIndex);
    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error generating PDF blob URL:', error);
    return null;
  }
}

/**
 * Builds an authentic University End-Semester Examination PYQ Paper PDF.
 */
export function buildPyqPaperPdfDoc(paper: PYQPaper): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Top University Banner & Exam Header
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('UNIVERSITY END SEMESTER EXAMINATION', 105, 12, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text(`Official Academic Repository • ${paper.course} • Semester ${paper.semester}`, 105, 19, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Paper Code: CS-${paper.semester}0${(paper.year % 10) + 1} • Session ${paper.year - 1}-${paper.year}`, 105, 26, { align: 'center' });

  // Accent Line
  doc.setFillColor(59, 130, 246); // blue-500
  doc.rect(0, 35, 210, 2, 'F');

  // Paper Details Card
  let y = 44;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(12, y, 186, 26, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, y, 186, 26, 2, 2, 'D');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(paper.subject, 18, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Time Allowed: ${paper.durationMinutes} Minutes (3 Hours)`, 18, y + 15);
  doc.text(`Maximum Marks: ${paper.totalMarks}`, 18, y + 21);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`Examination Year: ${paper.year}`, 130, y + 15);
  doc.text(`Evaluation: Regular End-Sem`, 130, y + 21);

  // General Instructions
  y += 32;
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text('Note: 1. Attempt all questions. 2. Make suitable assumptions where necessary. 3. Neat diagrams carry due weightage.', 14, y);

  y += 6;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, 196, y);
  y += 8;

  // Questions listing
  paper.questions.forEach((q, idx) => {
    // Check if new page is needed
    if (y > 240) {
      doc.addPage();
      y = 20;

      // Mini header for subsequent pages
      doc.setFillColor(241, 245, 249);
      doc.rect(0, 0, 210, 12, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`${paper.subject} (${paper.year}) — Continued`, 14, 8);
      doc.text(`Max Marks: ${paper.totalMarks}`, 180, 8);
      y += 6;
    }

    // Question number & Marks badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Question ${q.qNumber || idx + 1}:`, 14, y);

    // Topic pill
    if (q.topic) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text(`[${q.topic}]`, 42, y);
    }

    // Marks right aligned
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`[${q.marks} Marks]`, 196, y, { align: 'right' });

    y += 5.5;

    // Question body text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    const qLines = doc.splitTextToSize(q.text, 180);
    doc.text(qLines, 16, y);
    y += qLines.length * 4.8 + 2;

    // Default Answer / Marking scheme summary box
    if (q.defaultAnswer) {
      const ansLines = doc.splitTextToSize(`Model Solution / Key Points: ${q.defaultAnswer}`, 174);
      const boxHeight = ansLines.length * 4 + 6;

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(16, y, 180, boxHeight, 1.5, 1.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(16, y, 180, boxHeight, 1.5, 1.5, 'D');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(ansLines, 20, y + 4.5);

      y += boxHeight + 6;
    } else {
      y += 4;
    }

    // Light divider between questions
    doc.setDrawColor(241, 245, 249);
    doc.line(14, y - 2, 196, y - 2);
    y += 2;
  });

  // Footer on last page
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('*** END OF QUESTION PAPER ***', 105, Math.min(278, y + 8), { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('CampusHub Verified Academic Paper Archive • BBDITM / AKTU', 14, 288);
  doc.text('Official Examination Division', 154, 288);

  return doc;
}

/**
 * Downloads a PYQ Question Paper as an academic PDF document.
 */
export function downloadPyqPaperPdf(paper: PYQPaper): boolean {
  try {
    const doc = buildPyqPaperPdfDoc(paper);
    const safeTitle = `${paper.subject.replace(/[^a-zA-Z0-9_-]/g, '_')}_${paper.year}_PYQ`;
    doc.save(`${safeTitle}.pdf`);
    return true;
  } catch (error) {
    console.error('Error downloading PYQ PDF:', error);
    return false;
  }
}

/**
 * Generates an in-memory Blob URL for previewing the PYQ PDF directly in an iframe modal.
 */
export function generatePyqPdfBlobUrl(paper: PYQPaper): string | null {
  try {
    const doc = buildPyqPaperPdfDoc(paper);
    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error generating PYQ PDF blob URL:', error);
    return null;
  }
}
