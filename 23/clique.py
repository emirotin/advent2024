from numpy import genfromtxt
import numpy as np
import os
import csv
import matplotlib.pyplot as plt
import networkx as nx

matrix = genfromtxt(os.path.dirname(os.path.realpath(__file__)) + '/matrix.csv', delimiter=',')
vertexes = []
with open(os.path.dirname(os.path.realpath(__file__)) + '/vert.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',')
    for row in spamreader:
        vertexes = row
        break


rows, cols = np.where(matrix == 1)
gr = nx.Graph()
gr.add_nodes_from(vertexes)
edges = zip(rows.tolist(), cols.tolist())
gr.add_edges_from(edges)

cliques = list(nx.find_cliques(gr))
largest_clique = max(cliques, key=len)

verts = [vertexes[i] for i in largest_clique]
verts.sort()
print("Largest clique:", ','.join(verts))
