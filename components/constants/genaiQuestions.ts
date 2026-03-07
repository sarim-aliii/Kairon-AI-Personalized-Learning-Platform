import { Question } from "../../types"

export const genaiQuestions: Question[] = [
    { id: 'ai_1', title: 'How does the Transformer architecture work?', difficulty: 'Concept', link: 'https://jalammar.github.io/illustrated-transformer/' },
    { id: 'ai_2', title: 'Explain Attention Mechanism', difficulty: 'Medium', link: 'https://lilianweng.github.io/posts/2018-06-24-attention/' },
    { id: 'ai_3', title: 'What is RAG (Retrieval-Augmented Generation)?', difficulty: 'Easy', link: 'https://www.pinecone.io/learn/retrieval-augmented-generation/' },
    { id: 'ai_4', title: 'Fine-tuning vs Prompt Engineering', difficulty: 'Medium', link: 'https://platform.openai.com/docs/guides/prompt-engineering' },
    { id: 'ai_5', title: 'Explain Hallucinations in LLMs', difficulty: 'Concept', link: 'https://platform.openai.com/docs/guides/reducing-hallucinations' },

    { id: 'ai_6', title: 'What is a Language Model?', difficulty: 'Easy', link: 'https://huggingface.co/learn/nlp-course/chapter1/1' },
    { id: 'ai_7', title: 'Tokenization: BPE, WordPiece, SentencePiece', difficulty: 'Medium', link: 'https://huggingface.co/learn/nlp-course/chapter6/1' },
    { id: 'ai_8', title: 'Word Embeddings: word2vec, GloVe', difficulty: 'Medium', link: 'https://jalammar.github.io/illustrated-word2vec/' },
    { id: 'ai_9', title: 'What are Positional Encodings in Transformers?', difficulty: 'Medium', link: 'https://kazemnejad.com/blog/transformer_architecture_positional_encoding/' },
    { id: 'ai_10', title: 'Self-Attention vs Cross-Attention', difficulty: 'Medium', link: 'https://machinelearningmastery.com/the-transformer-model/' },

    { id: 'ai_11', title: 'Explain Encoder-Decoder vs Decoder-only Transformers', difficulty: 'Concept', link: 'https://huggingface.co/docs/transformers/model_summary' },
    { id: 'ai_12', title: 'Explain Multi-Head Attention', difficulty: 'Medium', link: 'https://jalammar.github.io/illustrated-transformer/' },
    { id: 'ai_13', title: 'Explain Layer Normalization vs Batch Normalization', difficulty: 'Medium', link: 'https://arxiv.org/abs/1607.06450' },
    { id: 'ai_14', title: 'What is the Feed-Forward Network in Transformers?', difficulty: 'Easy', link: 'https://jalammar.github.io/illustrated-transformer/' },
    { id: 'ai_15', title: 'Explain Pre-training vs Fine-tuning in NLP', difficulty: 'Concept', link: 'https://huggingface.co/learn/nlp-course/chapter2/2' },

    { id: 'ai_16', title: 'Explain Masked Language Modeling (BERT)', difficulty: 'Medium', link: 'https://jalammar.github.io/illustrated-bert/' },
    { id: 'ai_17', title: 'Explain Causal Language Modeling (GPT)', difficulty: 'Medium', link: 'https://huggingface.co/docs/transformers/tasks/language_modeling' },
    { id: 'ai_18', title: 'What is Next-Token Prediction?', difficulty: 'Easy', link: 'https://platform.openai.com/docs/guides/text-generation' },
    { id: 'ai_19', title: 'Explain Sequence-to-Sequence Models', difficulty: 'Concept', link: 'https://colah.github.io/posts/2015-08-Understanding-LSTMs/' },
    { id: 'ai_20', title: 'RNN vs LSTM vs GRU', difficulty: 'Medium', link: 'https://colah.github.io/posts/2015-08-Understanding-LSTMs/' },

    { id: 'ai_21', title: 'Explain Cross-Entropy Loss', difficulty: 'Easy', link: 'https://machinelearningmastery.com/cross-entropy-for-machine-learning/' },
    { id: 'ai_22', title: 'Explain Softmax and its role in classification', difficulty: 'Easy', link: 'https://deepai.org/machine-learning-glossary-and-terms/softmax-layer' },
    { id: 'ai_23', title: 'Gradient Descent and its Variants (SGD, Adam, RMSProp)', difficulty: 'Medium', link: 'https://ruder.io/optimizing-gradient-descent/' },
    { id: 'ai_24', title: 'Overfitting vs Underfitting', difficulty: 'Easy', link: 'https://scikit-learn.org/stable/modules/learning_curve.html' },
    { id: 'ai_25', title: 'Bias-Variance Tradeoff', difficulty: 'Concept', link: 'https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html' },

    { id: 'ai_26', title: 'Explain Regularization (L1, L2, Dropout)', difficulty: 'Medium', link: 'https://www.deeplearningbook.org/contents/regularization.html' },
    { id: 'ai_27', title: 'What is Batch Normalization?', difficulty: 'Easy', link: 'https://arxiv.org/abs/1502.03167' },
    { id: 'ai_28', title: 'Explain Residual Connections (ResNets)', difficulty: 'Medium', link: 'https://arxiv.org/abs/1512.03385' },
    { id: 'ai_29', title: 'Explain Vanishing/Exploding Gradients', difficulty: 'Medium', link: 'https://www.deeplearningbook.org/contents/optimization.html' },
    { id: 'ai_30', title: 'What is Epoch, Batch, and Mini-batch?', difficulty: 'Easy', link: 'https://machinelearningmastery.com/difference-between-a-batch-and-an-epoch/' },

    { id: 'ai_31', title: 'Explain Vector Databases (Pinecone, FAISS, Chroma)', difficulty: 'Medium', link: 'https://www.pinecone.io/learn/vector-database/' },
    { id: 'ai_32', title: 'Cosine Similarity vs Euclidean Distance in Embeddings', difficulty: 'Medium', link: 'https://developers.google.com/machine-learning/clustering/similarity/measuring-similarity' },
    { id: 'ai_33', title: 'Explain Text Embeddings (sentence-level, document-level)', difficulty: 'Concept', link: 'https://openai.com/index/introducing-text-and-code-embeddings/' },
    { id: 'ai_34', title: 'What is Chunking in RAG pipelines?', difficulty: 'Easy', link: 'https://www.pinecone.io/learn/chunking-strategies/' },
    { id: 'ai_35', title: 'Explain Top-k and Top-p (Nucleus) Sampling', difficulty: 'Medium', link: 'https://huggingface.co/blog/how-to-generate' },

    { id: 'ai_36', title: 'Explain Temperature in Text Generation', difficulty: 'Easy', link: 'https://platform.openai.com/docs/guides/text-generation' },
    { id: 'ai_37', title: 'What is Beam Search?', difficulty: 'Medium', link: 'https://towardsdatascience.com/beam-search-decoding-in-sequence-models-60b5e43a9a64' },
    { id: 'ai_38', title: 'Explain Exposure Bias in Sequence Models', difficulty: 'Hard', link: 'https://arxiv.org/abs/1511.06732' },
    { id: 'ai_39', title: 'Explain RLHF (Reinforcement Learning from Human Feedback)', difficulty: 'Hard', link: 'https://openai.com/blog/chatgpt' },
    { id: 'ai_40', title: 'What is a Reward Model in LLM training?', difficulty: 'Medium', link: 'https://huggingface.co/blog/rlhf' },

    { id: 'ai_41', title: 'Explain Supervised vs Unsupervised vs Self-supervised Learning', difficulty: 'Concept', link: 'https://www.deeplearningbook.org/contents/representation.html' },
    { id: 'ai_42', title: 'Explain Contrastive Learning (SimCLR, InfoNCE)', difficulty: 'Hard', link: 'https://arxiv.org/abs/2002.05709' },
    { id: 'ai_43', title: 'Explain Autoencoders and Denoising Autoencoders', difficulty: 'Medium', link: 'https://www.deeplearningbook.org/contents/autoencoders.html' },
    { id: 'ai_44', title: 'What are Variational Autoencoders (VAEs)?', difficulty: 'Hard', link: 'https://arxiv.org/abs/1312.6114' },
    { id: 'ai_45', title: 'Explain GANs (Generative Adversarial Networks)', difficulty: 'Medium', link: 'https://arxiv.org/abs/1406.2661' },

    { id: 'ai_46', title: 'Explain Diffusion Models (Stable Diffusion / DALL·E style)', difficulty: 'Hard', link: 'https://lilianweng.github.io/posts/2021-07-11-diffusion-models/' },
    { id: 'ai_47', title: 'Explain Encoder-only vs Decoder-only vs Encoder-Decoder Architectures', difficulty: 'Concept', link: 'https://huggingface.co/docs/transformers/model_summary' },
    { id: 'ai_48', title: 'Explain Multi-modal Models (text+image)', difficulty: 'Medium', link: 'https://openai.com/research/clip' },
    { id: 'ai_49', title: 'What is CLIP and how does it work?', difficulty: 'Medium', link: 'https://openai.com/research/clip' },
    { id: 'ai_50', title: 'Explain Vision Transformers (ViT)', difficulty: 'Hard', link: 'https://arxiv.org/abs/2010.11929' },

    { id: 'ai_51', title: 'Explain Precision, Recall, and F1-score', difficulty: 'Easy', link: 'https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics' },
    { id: 'ai_52', title: 'Confusion Matrix and ROC-AUC', difficulty: 'Medium', link: 'https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc' },
    { id: 'ai_53', title: 'Explain Perplexity in Language Models', difficulty: 'Medium', link: 'https://huggingface.co/docs/transformers/perplexity' },
    { id: 'ai_54', title: 'Explain BLEU / ROUGE for text evaluation', difficulty: 'Medium', link: 'https://huggingface.co/docs/evaluate/index' },
    { id: 'ai_55', title: 'What are Benchmarks for LLMs (MMLU, HELM, etc.)?', difficulty: 'Hard', link: 'https://crfm.stanford.edu/helm/latest/' },

    { id: 'ai_56', title: 'Explain Catastrophic Forgetting in Neural Networks', difficulty: 'Hard', link: 'https://www.deeplearningbook.org/contents/generative_models.html' },
    { id: 'ai_57', title: 'Explain Transfer Learning in Deep Learning', difficulty: 'Medium', link: 'https://cs231n.github.io/transfer-learning/' },
    { id: 'ai_58', title: 'Explain Knowledge Distillation', difficulty: 'Medium', link: 'https://arxiv.org/abs/1503.02531' },
    { id: 'ai_59', title: 'Parameter-Efficient Fine-Tuning (LoRA, Adapters)', difficulty: 'Medium', link: 'https://huggingface.co/docs/peft/index' },
    { id: 'ai_60', title: 'What are Instruction-tuned Models?', difficulty: 'Concept', link: 'https://arxiv.org/abs/2212.10560' },

    { id: 'ai_61', title: 'Explain Zero-shot, One-shot, and Few-shot Learning', difficulty: 'Concept', link: 'https://arxiv.org/abs/2005.14165' },
    { id: 'ai_62', title: 'Prompt Design: System, User, Assistant messages', difficulty: 'Easy', link: 'https://platform.openai.com/docs/guides/prompt-engineering' },
    { id: 'ai_63', title: 'Explain Chain-of-Thought Prompting', difficulty: 'Medium', link: 'https://arxiv.org/abs/2201.11903' },
    { id: 'ai_64', title: 'Explain Tool Use / Function Calling in LLMs', difficulty: 'Medium', link: 'https://platform.openai.com/docs/guides/function-calling' },
    { id: 'ai_65', title: 'Safety Techniques: Refusals, Guardrails, Content Filters', difficulty: 'Concept', link: 'https://platform.openai.com/docs/guides/safety-best-practices' },

    { id: 'ai_66', title: 'Explain Data Leakage in ML', difficulty: 'Medium', link: 'https://www.kaggle.com/code/alexisbcook/data-leakage' },
    { id: 'ai_67', title: 'Explain Train/Validation/Test Split and Cross-validation', difficulty: 'Easy', link: 'https://scikit-learn.org/stable/modules/cross_validation.html' },
    { id: 'ai_68', title: 'Hyperparameter Tuning (Grid Search, Random Search, Bayesian)', difficulty: 'Medium', link: 'https://scikit-learn.org/stable/modules/grid_search.html' },
    { id: 'ai_69', title: 'Explain Feature Engineering and Feature Scaling', difficulty: 'Medium', link: 'https://scikit-learn.org/stable/data_transforms.html' },
    { id: 'ai_70', title: 'Explain Handling Imbalanced Datasets', difficulty: 'Medium', link: 'https://imbalanced-learn.org/stable/' },

    { id: 'ai_71', title: 'Explain k-NN, SVM, and Decision Trees basics', difficulty: 'Easy', link: 'https://scikit-learn.org/stable/supervised_learning.html' },
    { id: 'ai_72', title: 'Random Forests and Gradient Boosting (XGBoost, LightGBM)', difficulty: 'Medium', link: 'https://xgboost.readthedocs.io/en/stable/' },
    { id: 'ai_73', title: 'Explain k-means and Clustering', difficulty: 'Easy', link: 'https://scikit-learn.org/stable/modules/clustering.html#k-means' },
    { id: 'ai_74', title: 'Explain PCA and Dimensionality Reduction', difficulty: 'Medium', link: 'https://scikit-learn.org/stable/modules/decomposition.html#principal-component-analysis-pca' },
    { id: 'ai_75', title: 'Explain t-SNE / UMAP for Visualization', difficulty: 'Medium', link: 'https://distill.pub/2016/misread-tsne/' },

    { id: 'ai_76', title: 'Reinforcement Learning basics: Agent, Environment, Reward', difficulty: 'Concept', link: 'https://spinningup.openai.com/en/latest/spinningup/rl_intro.html' },
    { id: 'ai_77', title: 'Q-learning vs Policy Gradients', difficulty: 'Hard', link: 'https://spinningup.openai.com/en/latest/spinningup/rl_intro2.html' },
    { id: 'ai_78', title: 'Explain Multi-armed Bandit Problem', difficulty: 'Medium', link: 'https://lilianweng.github.io/posts/2018-01-23-multi-armed-bandit/' },
    { id: 'ai_79', title: 'Explain Markov Decision Processes (MDP)', difficulty: 'Hard', link: 'https://web.mit.edu/dimitrib/www/mdp.pdf' },
    { id: 'ai_80', title: 'Explain Offline RL / Logged Bandits in Product Systems', difficulty: 'Hard', link: 'https://arxiv.org/abs/2005.01643' },

    { id: 'ai_81', title: 'Explain Adversarial Examples in Deep Learning', difficulty: 'Hard', link: 'https://arxiv.org/abs/1412.6572' },
    { id: 'ai_82', title: 'Explain Fairness, Bias, and Ethics in AI', difficulty: 'Concept', link: 'https://ai.google/responsibility/principles/' },
    { id: 'ai_83', title: 'Explain Explainable AI (SHAP, LIME)', difficulty: 'Medium', link: 'https://christophm.github.io/interpretable-ml-book/' },
    { id: 'ai_84', title: 'Data Privacy and Differential Privacy basics', difficulty: 'Hard', link: 'https://desfontain.es/privacy/differential-privacy-in-practice.html' },
    { id: 'ai_85', title: 'Federated Learning basics', difficulty: 'Hard', link: 'https://ai.googleblog.com/2017/04/federated-learning-collaborative.html' },

    { id: 'ai_86', title: 'What is MLOps (CI/CD for ML)?', difficulty: 'Concept', link: 'https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning' },
    { id: 'ai_87', title: 'Model Versioning and Model Registry', difficulty: 'Medium', link: 'https://mlflow.org/docs/latest/model-registry.html' },
    { id: 'ai_88', title: 'Monitoring ML in Production (Data & Model Drift)', difficulty: 'Medium', link: 'https://evidentlyai.com/blog/ml-monitoring' },
    { id: 'ai_89', title: 'Explain Online vs Batch Inference', difficulty: 'Medium', link: 'https://cloud.google.com/vertex-ai/docs/predictions/getting-predictions' },
    { id: 'ai_90', title: 'Explain A/B Testing and Experimentation for ML models', difficulty: 'Medium', link: 'https://www.microsoft.com/en-us/research/publication/online-controlled-experiments-at-large-scale/' },

    { id: 'ai_91', title: 'What are System Prompts and Guardrails in LLM apps?', difficulty: 'Concept', link: 'https://platform.openai.com/docs/guides/prompt-engineering/system-messages' },
    { id: 'ai_92', title: 'Explain Multi-Agent Systems using LLMs', difficulty: 'Hard', link: 'https://arxiv.org/abs/2308.10848' },
    { id: 'ai_93', title: 'Explain Toolformer / Self-Tool-Use', difficulty: 'Hard', link: 'https://arxiv.org/abs/2302.04761' },
    { id: 'ai_94', title: 'Guarding against Prompt Injection attacks', difficulty: 'Hard', link: 'https://learn.microsoft.com/en-us/azure/architecture/guide/ai/prompt-injection' },
    { id: 'ai_95', title: 'Evaluating RAG Systems (Groundedness, Faithfulness)', difficulty: 'Medium', link: 'https://docs.langchain.com/docs/concepts/evaluation/' },

    { id: 'ai_96', title: 'Agentic Workflows: Planners, Executors, Tools', difficulty: 'Hard', link: 'https://langchain.readthedocs.io/en/latest/modules/agents.html' },
    { id: 'ai_97', title: 'Explain LLM Orchestration Frameworks (LangChain, LlamaIndex)', difficulty: 'Medium', link: 'https://python.langchain.com/docs/get_started/introduction' },
    { id: 'ai_98', title: 'Safety Red Teaming for LLMs', difficulty: 'Hard', link: 'https://platform.openai.com/docs/guides/safety-best-practices' },
    { id: 'ai_99', title: 'Latency vs Cost vs Quality trade-offs in LLM systems', difficulty: 'Concept', link: 'https://platform.openai.com/docs/guides/rate-limits' },
    { id: 'ai_100', title: 'How to design a production-ready LLM-powered application end-to-end', difficulty: 'Hard', link: 'https://www.fullstackdeeplearning.com/' },
]

// =========== FUNDAMENTALS ===========
export const genaiFundamentals: Question[] = genaiQuestions.filter(q =>
  ['Easy','Concept'].includes(q.difficulty) &&
  parseInt(q.id.replace('ai_','')) <= 45  // first half mostly basics
);

// =========== ADVANCED / MODEL DEEP DIVE ===========
export const genaiAdvanced: Question[] = genaiQuestions.filter(q =>
  ['Medium','Hard'].includes(q.difficulty) &&
  parseInt(q.id.replace('ai_','')) > 20 && parseInt(q.id.replace('ai_','')) <= 70
);

// =========== SYSTEM & ARCHITECTURE ===========
export const genaiSystemAndArchitecture: Question[] = genaiQuestions.filter(q =>
  ['Medium','Hard','Concept'].includes(q.difficulty) &&
  parseInt(q.id.replace('ai_','')) > 70
);