<?php

use Rector\Config\RectorConfig;
use Rector\TypeDeclaration\Rector\StmtsAwareInterface\DeclareStrictTypesRector;
use Rector\TypeDeclaration\Rector\StmtsAwareInterface\SafeDeclareStrictTypesRector;

/*
 * Modern PHP and dead code, measured in --dry-run only (quality pass, phase 1).
 * declare(strict_types=1) is left out on purpose: it changes how PHP coerces
 * types, so it changes behaviour, which this pass may not do.
 */
return RectorConfig::configure()
    ->withPaths([__DIR__.'/src'])
    ->withPhpSets(php83: true)
    ->withPreparedSets(deadCode: true, codeQuality: true)
    ->withSkip([DeclareStrictTypesRector::class, SafeDeclareStrictTypesRector::class]);
