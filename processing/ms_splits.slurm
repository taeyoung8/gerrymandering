#!/bin/bash

#SBATCH --job-name=sp_ms
#SBATCH --output=sp_ms.txt
#SBATCH --nodes=1
#SBATCH --time=240:00
#SBATCH -p short-96core
#SBATCH --mail-type=BEGIN,END
#SBATCH --mail-user=nicholas.logozzo@stonybrook.edu

# Load Required Modules
module load anaconda/3
conda create -y -n sp_ms python=3.9
source activate sp_ms
pip install geopandas pandas

# Run
cd /gpfs/projects/CSE416/Hornets
python3 splits.py MS

# Cleanup
conda deactivate
conda remove -y -n sp_ms --all
