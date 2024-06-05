#!/bin/bash

#SBATCH --job-name=sp_ny
#SBATCH --output=sp_ny.txt
#SBATCH --nodes=1
#SBATCH --time=480:00
#SBATCH -p long-96core
#SBATCH --mail-type=BEGIN,END
#SBATCH --mail-user=nicholas.logozzo@stonybrook.edu

# Load Required Modules
module load anaconda/3
conda create -y -n sp_ny python=3.9
source activate sp_ny
pip install geopandas pandas

# Run
cd /gpfs/projects/CSE416/Hornets
python3 splits.py NY

# Cleanup
conda deactivate
conda remove -y -n sp_ny --all
